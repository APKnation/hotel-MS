export const CLEANING_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DIRTY: 'dirty'
};

export class Housekeeping {
  constructor(id, roomId, housekeeperId, assignedAt, notes = '') {
    this.id = id;
    this.roomId = roomId;
    this.housekeeperId = housekeeperId;
    this.assignedAt = assignedAt || new Date();
    this.completedAt = null;
    this.status = CLEANING_STATUS.PENDING;
    this.notes = notes;
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push({ task, completed: false });
  }

  completeTask(taskIndex) {
    if (this.tasks[taskIndex]) {
      this.tasks[taskIndex].completed = true;
    }
  }

  markCompleted() {
    this.status = CLEANING_STATUS.COMPLETED;
    this.completedAt = new Date();
  }
}
