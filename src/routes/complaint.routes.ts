import { Router } from "express";
import { authenticate } from "../middleware/authenticator";
import { validate } from "../middleware/validator";
import { createComplaintSchema, getComplaintSchema, getComplaintsSchema, updateComplaintSchema } from "../validators/complaint.validator";
import { createComplaint, getAllComplaints, getComplaint, updateComplaint } from "../controllers/complaint.controller";
import { createComplaintMessage, getComplaintMessage, getComplaintMessages } from "../controllers/complaint-message.controller";
import { createComplaintMessageSchema, getComplaintMessageSchema, getComplaintMessagesSchema } from "../validators/complaint-message.validator";

const router = Router();

router.post('/', authenticate, validate({body: createComplaintSchema}), createComplaint);

router.get('/messages', authenticate, validate({query: getComplaintMessagesSchema}), getComplaintMessages);
router.post('/messages', authenticate, validate({body: createComplaintMessageSchema}), createComplaintMessage);
router.get('/messages/:id', authenticate, validate({params: getComplaintMessageSchema}), getComplaintMessage);

router.get('/', authenticate, validate({query: getComplaintsSchema}), getAllComplaints);
router.get('/:id', authenticate, validate({params: getComplaintSchema}), getComplaint);
router.put('/:id', authenticate, validate({params: getComplaintSchema, body: updateComplaintSchema}), updateComplaint);

export default router;