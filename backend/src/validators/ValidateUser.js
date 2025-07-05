import { z } from "zod";

//
// Enums
//
export const RoleEnum = z.enum(["USER", "PROVIDER", "ADMIN"]);
export const BookingStatusEnum = z.enum(["PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"]);
export const TransactionTypeEnum = z.enum(["CREDIT", "DEBIT"]);
export const TransactionSourceEnum = z.enum(["TOPUP", "REFUND", "BOOKING"]);
export const NotificationTypeEnum = z.enum(["BOOKING", "WALLET", "ADMIN"]);
export const FileTypeEnum = z.enum(["PROFILE", "ID_PROOF", "CERTIFICATE", "OTHER"]);

//
// USER
//
export const signupSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(6),
  role: RoleEnum.default("USER")
});

export const deleteUserSchema = z.object({
  userId: z.string().uuid()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const updateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  phone: z.string().min(10).max(15).optional(),
  location: z.string().optional()
});

//
// OTP
//
export const otpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits")
});

export const otpPhoneVerifySchema = z.object({
  phone: z.string().min(10).max(15),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits")
});

//
// PROVIDER PROFILE
//
export const providerProfileSchema = z.object({
  categories: z.array(z.string()).min(1),
  skills: z.array(z.string()).min(1),
  rate: z.number().int().positive(),
  availability: z.boolean(),
  description: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  onboardingStatus: z.string().optional()
});

//
// BOOKING
//
export const bookingSchema = z.object({
  userId: z.string().uuid(),
  providerId: z.string().uuid(),
  category: z.string().min(2),
  dateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid datetime format"
  }),
  location: z.string().min(2),
  price: z.number().int().nonnegative(),
  notes: z.string().optional(),
  status: BookingStatusEnum.optional()
});

//
// WALLET TRANSACTION
//
export const walletTransactionSchema = z.object({
  userId: z.string().uuid(),
  walletId: z.string().uuid(),
  amount: z.number().int().nonnegative(),
  type: TransactionTypeEnum,
  source: TransactionSourceEnum
});

//
// REVIEW
//
export const reviewSchema = z.object({
  userId: z.string().uuid(),
  providerId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional()
});

//
// NOTIFICATION
//
export const notificationSchema = z.object({
  userId: z.string().uuid(),
  message: z.string().min(1),
  type: NotificationTypeEnum
});

//
// FILE
//
export const fileSchema = z.object({
  userId: z.string().uuid(),
  url: z.string().url(),
  type: FileTypeEnum
});

//
// AVAILABILITY SLOT
//
export const availabilitySlotSchema = z.object({
  providerId: z.string().uuid(),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start time"
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end time"
  }),
  isBooked: z.boolean().optional()
});

//
// MESSAGE
//
export const messageSchema = z.object({
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  content: z.string().min(1)
});

//
// COUPON
//
export const couponSchema = z.object({
  code: z.string().min(3).max(20),
  discount: z.number().int().min(1).max(100),
  maxAmount: z.number().int().positive(),
  expiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid expiry date"
  }),
  isActive: z.boolean().default(true)
});

//
// SERVICE CATEGORY
//
export const serviceCategorySchema = z.object({
  name: z.string().min(2),
  image: z.string().url().optional()
});
