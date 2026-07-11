import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser, UserRole } from './User';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface IPayment extends Document {
  user: IUser['_id'];
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  subscriptionType: UserRole;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user ID'],
    },
    razorpayPaymentId: {
      type: String,
      required: [true, 'Please provide Razorpay payment ID'],
    },
    razorpayOrderId: {
      type: String,
      required: [true, 'Please provide Razorpay order ID'],
    },
    razorpaySignature: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide amount'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    subscriptionType: {
      type: String,
      enum: [UserRole.BROKER, UserRole.OWNER, UserRole.TENANT],
      required: [true, 'Please provide subscription type'],
    },
    subscriptionStartDate: {
      type: Date,
      required: [true, 'Please provide subscription start date'],
    },
    subscriptionEndDate: {
      type: Date,
      required: [true, 'Please provide subscription end date'],
    },
  },
  { timestamps: true }
);

// Create indexes for better query performance
PaymentSchema.index({ user: 1 });
PaymentSchema.index({ razorpayPaymentId: 1 });
PaymentSchema.index({ razorpayOrderId: 1 });
PaymentSchema.index({ status: 1 });

// Prevent mongoose from creating a new model if it already exists
const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
