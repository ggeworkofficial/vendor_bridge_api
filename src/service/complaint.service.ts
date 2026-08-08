import { randomUUID } from 'crypto';
import { CreateComplaintBody, GetComplaintParam, GetComplaintsQuery, UpdateComplaintBody } from '../validators/complaint.validator';
import { createComplaint, getComplaint, getComplaints, updateComplaint, removeComplaint, ComplaintResult, CreateComplaintResult } from '../repositories/complaint.repository';
import { PaginationResponse } from '../types/pageination';
import { createError } from '../helpers/error';
import { removeUndefined } from '../utils/removeUndefined';
import { ComplaintPriority, ComplaintStatus } from '../models/complaint.model';
import { getOrderByUserId } from '../repositories/receipt.repository';
import { Role } from '../middleware/roleChecker';

export class ComplaintService {
  async create(user_id: string, data: CreateComplaintBody): Promise<CreateComplaintResult> {
    const complaintData = {
      id: randomUUID(),
      subject: data.subject,
      description: data.description,
      order_id: data.order_id,
      priority: 'medium' as ComplaintPriority,
      status: 'open' as ComplaintStatus,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const order = await getOrderByUserId(complaintData.order_id, user_id);
    if (!order) throw createError("Forbidden", 403);

    return await createComplaint(complaintData);
  }

  async getOne(id: GetComplaintParam['id'], user_id: string, role: Role): Promise<ComplaintResult> {
    const complaint = await getComplaint(id);

    if (!complaint) throw createError('Complaint not found', 404);
    if (role !== 'admin' && complaint.user.id !== user_id) throw createError("Forbidden", 403)

    return complaint;
  }

  async getAll(user_id: string, role: Role, query: GetComplaintsQuery): Promise<PaginationResponse<ComplaintResult>> {
    const cleanQuery = removeUndefined(query);
    return await getComplaints(cleanQuery, role === 'admin' ? null : user_id);
  }

  async update(id: GetComplaintParam['id'], user_id: string, role: Role, data: UpdateComplaintBody): Promise<ComplaintResult> {
    const complaint = await getComplaint(id);

    if (!complaint) throw createError("Complaint not found", 404);
    
    if (role !== 'admin' && complaint.user.id !== user_id) throw createError("Forbidden", 403);
    if (role !== 'admin' && 'status' in data) throw createError("Forbidden", 403);
    if (role !== 'admin' && 'priority' in data) throw createError("Forbidden", 403);

    if (complaint.status !== 'open' && ('subject' in data || 'description' in data)) throw createError("Complaint is not open", 400);

    const cleanData = removeUndefined({ ...data, updated_at: new Date() });
    const modifiedComplaint = await updateComplaint(id, cleanData);
    if (!modifiedComplaint) throw createError("Complaint not found", 404);

    return modifiedComplaint;
  }

//   async remove(id: GetComplaintParam['id'], user_id: string, role: Role): Promise<boolean> {
//     const complaint = await getComplaint(id);

//     if (!complaint) throw createError("Complaint not found", 404);
//     if (role !== 'admin' && complaint.user.id !== user_id) throw createError("Forbidden", 403);
    
//     const deleted = await removeComplaint(id);
//     if (!deleted) throw createError('Complaint not found', 404);
//     return deleted;
//   }
}
