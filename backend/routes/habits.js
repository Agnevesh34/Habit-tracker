const express = require('express');
const Habit = require('../models/Habit');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/habits/add
 * @desc    Create a new habit
 * @access  Private (Requires Auth)
 */
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Habit name is required" });
    }
    const newHabit = new Habit({ userId: req.user.userId, name, completedDates: [] });
    await newHabit.save();
    res.status(201).json({ message: "✅ Habit added successfully!", habit: newHabit });
  } catch (err) {
    console.error("Error creating habit:", err);
    res.status(500).json({ error: err.message || "Failed to create habit" });
  }
});

/**
 * @route   PATCH /api/habits/complete/:habitId
 * @desc    Mark a habit as completed for today
 * @access  Private (Requires Auth)
 */
router.patch('/complete/:habitId', authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.habitId, userId: req.user.userId });
    if (!habit) {
      return res.status(404).json({ error: "❌ Habit not found" });
    }
    const today = new Date().toISOString().split('T')[0];
    if (!habit.completedDates.includes(today)) {
      habit.completedDates.push(today);
      await habit.save();
    }
    res.json({ message: "✅ Habit marked as complete!", habit });
  } catch (err) {
    console.error("Error marking habit complete:", err);
    res.status(500).json({ error: err.message || "Failed to update habit" });
  }
});

/**
 * @route   GET /api/habits
 * @desc    Get all habits for the logged-in user
 * @access  Private (Requires Auth)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.userId });
    res.json({ message: "📜 Habits fetched successfully!", habits });
  } catch (err) {
    console.error("Error fetching habits:", err);
    res.status(500).json({ error: err.message || "Failed to fetch habits" });
  }
});

/**
 * @route   DELETE /api/habits/:habitId
 * @desc    Delete a habit
 * @access  Private (Requires Auth)
 */
router.delete('/:habitId', authMiddleware, async (req, res) => {
  try {
    console.log("Deleting Habit ID:", req.params.habitId);
    console.log("User ID from Token:", req.user.userId);
    
    const habit = await Habit.findOneAndDelete({ _id: req.params.habitId.toString(), userId: req.user.userId.toString() });
    if (!habit) {
      return res.status(404).json({ error: "❌ Habit not found" });
    }
    res.json({ message: "✅ Habit deleted successfully!", habit });
  } catch (err) {
    console.error("Error deleting habit:", err);
    res.status(500).json({ error: err.message || "Failed to delete habit" });
  }
});

module.exports = router;






