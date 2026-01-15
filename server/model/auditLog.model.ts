import mongoose, { Schema, Document } from 'mongoose'

export interface AuditLogDocument extends Document {
  actorId: mongoose.Types.ObjectId  //who
  actorRole: 'user' | 'admin'
  action: string
  targetType: 'note' | 'user' | 'auth'
  targetId?: mongoose.Types.ObjectId
  metadata?: Record<string, any>
  createdAt: Date
}

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    actorRole: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ['note', 'user', 'auth'],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export const AuditLog = mongoose.model<AuditLogDocument>(
  'AuditLog',
  auditLogSchema
)
