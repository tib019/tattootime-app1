import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAppointments, getAppointment, createAppointment, updateAppointment } from '../services/appointmentService';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('appointmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAppointments', () => {
    it('fetches appointments from API', async () => {
      const mockAppointments = [
        { id: 1, title: 'Appointment 1' },
        { id: 2, title: 'Appointment 2' },
      ];
      api.get.mockResolvedValue({ data: mockAppointments });

      const result = await getAppointments();
      expect(api.get).toHaveBeenCalledWith('/appointments', { params: undefined });
      expect(result).toEqual(mockAppointments);
    });

    it('fetches appointments with params', async () => {
      const mockAppointments = [{ id: 1, title: 'Filtered Appointment' }];
      api.get.mockResolvedValue({ data: mockAppointments });

      const params = { date: '2025-01-01', status: 'pending' };
      const result = await getAppointments(params);
      expect(api.get).toHaveBeenCalledWith('/appointments', { params });
      expect(result).toEqual(mockAppointments);
    });

    it('throws error on API failure', async () => {
      api.get.mockRejectedValue({
        response: { data: { message: 'Server Error' } },
      });

      await expect(getAppointments()).rejects.toThrow('Server Error');
    });

    it('throws generic error when no API message', async () => {
      api.get.mockRejectedValue(new Error('Network Error'));

      await expect(getAppointments()).rejects.toThrow(/Fehler beim Abrufen der Termine/i);
    });
  });

  describe('getAppointment', () => {
    it('fetches a single appointment by id', async () => {
      const mockAppointment = { id: 1, title: 'Specific Appointment' };
      api.get.mockResolvedValue({ data: mockAppointment });

      const result = await getAppointment(1);
      expect(api.get).toHaveBeenCalledWith('/appointments/1');
      expect(result).toEqual(mockAppointment);
    });

    it('throws error when appointment not found', async () => {
      api.get.mockRejectedValue({
        response: { data: { message: 'Appointment not found' } },
      });

      await expect(getAppointment(999)).rejects.toThrow('Appointment not found');
    });
  });

  describe('createAppointment', () => {
    it('creates a new appointment', async () => {
      const appointmentData = {
        title: 'New Appointment',
        start: '2025-01-01T10:00',
        end: '2025-01-01T12:00',
      };
      const mockResponse = { id: 3, ...appointmentData };
      api.post.mockResolvedValue({ data: mockResponse });

      const result = await createAppointment(appointmentData);
      expect(api.post).toHaveBeenCalledWith('/appointments', appointmentData);
      expect(result).toEqual(mockResponse);
    });

    it('throws error on creation failure', async () => {
      api.post.mockRejectedValue({
        response: { data: { message: 'Validation Error' } },
      });

      await expect(createAppointment({})).rejects.toThrow('Validation Error');
    });
  });

  describe('updateAppointment', () => {
    it('updates an existing appointment', async () => {
      const updateData = { title: 'Updated Appointment' };
      const mockResponse = { id: 1, ...updateData };
      api.put.mockResolvedValue({ data: mockResponse });

      const result = await updateAppointment(1, updateData);
      expect(api.put).toHaveBeenCalledWith('/appointments/1', updateData);
      expect(result).toEqual(mockResponse);
    });
  });
});
