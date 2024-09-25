

export interface IMessage {
  id: string
  roomId: string
  type: 'text' | 'image' | 'file'
  payload: any
  // createdAt: Date
  createdBy: string
  // updatedAt: Date
  // updatedBy: string
  // deletedAt: Date | null
};