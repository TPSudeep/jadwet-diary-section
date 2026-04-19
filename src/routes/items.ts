import express from 'express';
import { body, param, query } from 'express-validator';

const router = express.Router();

// Dummy data and types for validation
const validTypes = ['package', 'letter', 'bill'];

let items = []; // Array to hold items, in a real scenario this would be your database.

// GET / - Retrieve all items with joined user and department data
router.get('/', (req, res) => {
    // Logic to retrieve items with user and department data would go here
    res.json(items);
});

// POST / - Create a new item with type validation
router.post(
    '/',
    body('type').isIn(validTypes).withMessage('Type must be one of: package, letter, bill'),
    (req, res) => {
        const newItem = req.body;
        // Logic to save the new item to your database
        items.push(newItem);
        res.status(201).json(newItem);
    }
);

// PATCH /:id/signoff - Mark item as signed off
router.patch(
    '/:id/signoff',
    param('id').isInt().withMessage('Invalid item ID'),
    body('signed_off_by').isString(),
    (req, res) => {
        const id = parseInt(req.params.id);
        const { signed_off_by } = req.body;
        // Logic to find the item by ID and mark as signed off
        const item = items.find(item => item.id === id);
        if (item) {
            item.signed_off = true;
            item.signed_off_by = signed_off_by;
            item.timestamp = '2026-04-19 11:41:34';
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    }
);

// GET /search - Filtering items
router.get('/search', 
    query('sender').optional().isString(),
    query('type').optional().isIn(validTypes),
    query('status').optional().isString(),
    (req, res) => {
        let filteredItems = items;
        const { sender, type, status } = req.query;

        if (sender) {
            filteredItems = filteredItems.filter(item => item.sender === sender);
        }
        if (type) {
            filteredItems = filteredItems.filter(item => item.type === type);
        }
        if (status) {
            filteredItems = filteredItems.filter(item => item.status === status);
        }

        res.json(filteredItems);
    }
);

export default router;