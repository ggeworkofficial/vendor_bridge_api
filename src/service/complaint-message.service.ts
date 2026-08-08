import { randomUUID } from 'crypto';
import { CreateComplaintMessageBody, GetComplaintMessageParam, GetComplaintMessagesQuery } from '../validators/complaint-message.validator';
import { createComplaintMessage, getComplaintMessage, getComplaintMessages, ComplaintMessageResult } from '../repositories/complaint-message.repository';
import { createError } from '../helpers/error';
import { removeUndefined } from '../utils/removeUndefined';
import { ComplaintService } from './complaint.service';
import { Role } from '../middleware/roleChecker';

const complaintService = new ComplaintService();

export class ComplaintMessageService {
  async create(user_id: string, role: Role, data: CreateComplaintMessageBody): Promise<ComplaintMessageResult> {
    const complaint = await complaintService.getOne(data.complaint_id, user_id, role);
    
    if (complaint.status === 'resolved') throw createError('Complaint is resolved', 400);

    const msgData = {
      id: randomUUID(),
      complaint_id: data.complaint_id,
      sender_id: user_id,
      message: data.message,
      created_at: new Date(),
    };

    return await createComplaintMessage(msgData);
  }

  async getOne(id: GetComplaintMessageParam['id'], user_id: string, role: Role): Promise<ComplaintMessageResult> {
    const found = await getComplaintMessage(id);
    if (!found) throw createError('Message not found', 404);

    const complaint = await complaintService.getOne(found.complaint_id || '', user_id, role);

    // if (role !== 'admin' && complaint.user.id !== user_id) throw createError('Forbidden', 403);

    return found.data;
  }

  async getAll(user_id: string, role: Role, query: GetComplaintMessagesQuery) {
    const cleanQuery = removeUndefined(query);

    if (role !== 'admin') {
      // If user provided a complaint_id ensure they own it
      if (cleanQuery.complaint_id) {
        const complaint = await complaintService.getOne(cleanQuery.complaint_id, user_id, role);
        if (!complaint) throw createError('Forbidden', 403);
      }
    }

    return await getComplaintMessages(cleanQuery as any, role === 'admin' ? null : user_id);
  }
}

export default new ComplaintMessageService();
