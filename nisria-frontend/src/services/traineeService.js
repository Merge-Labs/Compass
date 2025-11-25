import { apiRequest } from './api';

/**
 * Get all trainees for a specific trainer
 * @param {string} trainerId - The ID of the trainer
 * @returns {Promise<{data: Array, error: Object|null}>} - Returns trainees data or error
 */
export const getTrainees = async (trainerId) => {
  return await apiRequest(
    'GET',
    `programs/maisha/vocational-trainers/${trainerId}/trainees/`
  );
};

/**
 * Add a new trainee to a trainer
 * @param {string} trainerId - The ID of the trainer
 * @param {Object} traineeData - The trainee data to add
 * @returns {Promise<{data: Object|null, error: Object|null}>} - Returns the created trainee or error
 */
export const addTrainee = async (trainerId, traineeData) => {
  return await apiRequest(
    'POST',
    `programs/maisha/vocational-trainers/${trainerId}/trainees/`,
    traineeData
  );
};

/**
 * Update a trainee
 * @param {string} trainerId - The ID of the trainer
 * @param {string} traineeId - The ID of the trainee to update
 * @param {Object} traineeData - The updated trainee data
 * @returns {Promise<{data: Object|null, error: Object|null}>} - Returns the updated trainee or error
 */
export const updateTrainee = async (trainerId, traineeId, traineeData) => {
  return await apiRequest(
    'PUT',
    `programs/maisha/vocational-trainers/${trainerId}/trainees/${traineeId}/`,
    traineeData
  );
};

/**
 * Delete a trainee
 * @param {string} trainerId - The ID of the trainer
 * @param {string} traineeId - The ID of the trainee to delete
 * @returns {Promise<{data: Object|null, error: Object|null}>} - Returns success or error
 */
export const deleteTrainee = async (trainerId, traineeId) => {
  return await apiRequest(
    'DELETE',
    `programs/maisha/vocational-trainers/${trainerId}/trainees/${traineeId}/`
  );
};
