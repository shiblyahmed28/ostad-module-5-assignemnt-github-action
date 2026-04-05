// backend/test/bmi.test.js
import { calculateMetrics } from '../src/calculations.js';

test('calculates BMI correctly for male', () => {
  const result = calculateMetrics({
    weightKg: 80,
    heightCm: 175,
    age: 30,
    sex: 'male',
    activity: 'moderate',
  });
  expect(result.bmi).toBeCloseTo(26.1, 1);
  expect(result.bmiCategory).toBe('Overweight');
});

test('calculates BMI correctly for female', () => {
  const result = calculateMetrics({
    weightKg: 60,
    heightCm: 165,
    age: 25,
    sex: 'female',
    activity: 'light',
  });
  expect(result.bmi).toBeCloseTo(22.0, 1);
  expect(result.bmiCategory).toBe('Normal');
});
