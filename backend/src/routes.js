import express from 'express';
import * as db from './db.js';
import { calculateMetrics } from './calculations.js';

const router = express.Router();

// POST
router.post('/measurements', async (req, res) => {
  try {
    const {weightKg,heightCm,age,sex,activity,measurementDate} = req.body;

    if (!weightKg || !heightCm || !age || !sex) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
      return res.status(400).json({ error: 'Invalid values' });
    }

    const m = calculateMetrics({weightKg,heightCm,age,sex,activity});
    const date = measurementDate || new Date().toISOString().split('T')[0];

    const q = `
      INSERT INTO measurements
      (weight_kg,height_cm,age,sex,activity_level,bmi,bmi_category,bmr,daily_calories,measurement_date,created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now())
      RETURNING *
    `;

    const v = [weightKg,heightCm,age,sex,activity,m.bmi,m.bmiCategory,m.bmr,m.dailyCalories,date];

    const r = await db.query(q,v);

    res.status(201).json({measurement:r.rows[0]});
  } catch(e){
    console.error(e);
    res.status(500).json({error:e.message});
  }
});

// GET
router.get('/measurements', async (req,res)=>{
  const r = await db.query('SELECT * FROM measurements ORDER BY measurement_date DESC');
  res.json({rows:r.rows});
});

export default router;
