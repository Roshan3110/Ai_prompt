import Prompt from "../models/Prompt.js";

export const getPrompts = async (req, res) => {
  try {
    const { search, category, favorite, sort } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "All") {
      query.category = category;
    }
    if (favorite === "true") {
      query.isFavorite = true;
    }

    let sortOption = { isPinned: -1, order: 1, createdDate: -1 };
    if (sort === "oldest") sortOption = { isPinned: -1, createdDate: 1 };
    if (sort === "newest") sortOption = { isPinned: -1, createdDate: -1 };
    if (sort === "az") sortOption = { isPinned: -1, title: 1 };
    if (sort === "za") sortOption = { isPinned: -1, title: -1 };

    const prompts = await Prompt.find(query).sort(sortOption);
    res.status(200).json({ success: true, count: prompts.length, data: prompts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET
export const getPromptById = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ success: false, message: "Prompt not found" });
    }
    res.status(200).json({ success: true, data: prompt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST 
export const createPrompt = async (req, res) => {
  try {
    const prompt = await Prompt.create(req.body);
    res.status(201).json({ success: true, data: prompt });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT 
export const updatePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!prompt) {
      return res.status(404).json({ success: false, message: "Prompt not found" });
    }
    res.status(200).json({ success: true, data: prompt });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE 
export const deletePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndDelete(req.params.id);
    if (!prompt) {
      return res.status(404).json({ success: false, message: "Prompt not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH 
export const reorderPrompts = async (req, res) => {
  try {
    const { items } = req.body; 
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "items must be an array" });
    }
    await Promise.all(
      items.map((item) =>
        Prompt.findByIdAndUpdate(item.id, { order: item.order })
      )
    );
    res.status(200).json({ success: true, message: "Order updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST 
export const importPrompts = async (req, res) => {
  try {
    const { prompts } = req.body;
    if (!Array.isArray(prompts)) {
      return res.status(400).json({ success: false, message: "prompts must be an array" });
    }
    const cleaned = prompts.map(({ _id, ...rest }) => rest);
    const created = await Prompt.insertMany(cleaned, { ordered: false });
    res.status(201).json({ success: true, count: created.length, data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
