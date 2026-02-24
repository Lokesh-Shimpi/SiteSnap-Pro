const express = require('express');
const router = express.Router();
const { checkProject, createProject, getProject, getProjects, getProjectImage, deleteProject } = require('../controllers/monitorController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:id/check', protect, checkProject);
router.post('/', protect, createProject);
router.get('/:id', protect, getProject);
router.get('/', protect, getProjects);
router.delete('/:id', protect, deleteProject);
router.get('/:id/image/:type', getProjectImage);

module.exports = router;
