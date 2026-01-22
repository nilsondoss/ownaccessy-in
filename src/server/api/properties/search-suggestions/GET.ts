import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { properties } from '../../../db/schema.js';
import { sql } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { query, type } = req.query;

    if (!query || typeof query !== 'string') {
      return res.json({ suggestions: [] });
    }

    const searchTerm = query.toLowerCase().trim();

    if (searchTerm.length < 2) {
      return res.json({ suggestions: [] });
    }

    // Get suggestions based on type
    if (type === 'location') {
      // Get unique locations that match the search term
      const locationResults = await db
        .selectDistinct({ location: properties.location })
        .from(properties)
        .where(sql`LOWER(${properties.location}) LIKE ${`%${searchTerm}%`}`)
        .limit(8);

      const suggestions = locationResults.map(r => ({
        type: 'location',
        value: r.location,
        label: r.location,
      }));

      return res.json({ suggestions });
    }

    if (type === 'title') {
      // Get property titles that match the search term
      const titleResults = await db
        .select({
          id: properties.id,
          title: properties.title,
          location: properties.location,
          type: properties.type,
        })
        .from(properties)
        .where(sql`LOWER(${properties.title}) LIKE ${`%${searchTerm}%`}`)
        .limit(8);

      const suggestions = titleResults.map(r => ({
        type: 'property',
        value: r.title,
        label: r.title,
        subtitle: r.location,
        propertyId: r.id,
        propertyType: r.type,
      }));

      return res.json({ suggestions });
    }

    // Default: mixed suggestions (locations + titles)
    const [locationResults, titleResults] = await Promise.all([
      db
        .selectDistinct({ location: properties.location })
        .from(properties)
        .where(sql`LOWER(${properties.location}) LIKE ${`%${searchTerm}%`}`)
        .limit(4),
      db
        .select({
          id: properties.id,
          title: properties.title,
          location: properties.location,
          type: properties.type,
        })
        .from(properties)
        .where(sql`LOWER(${properties.title}) LIKE ${`%${searchTerm}%`}`)
        .limit(4),
    ]);

    const suggestions = [
      ...locationResults.map(r => ({
        type: 'location',
        value: r.location,
        label: r.location,
      })),
      ...titleResults.map(r => ({
        type: 'property',
        value: r.title,
        label: r.title,
        subtitle: r.location,
        propertyId: r.id,
        propertyType: r.type,
      })),
    ];

    res.json({ suggestions });
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
}
