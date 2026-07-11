import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export enum BHKType {
  ONE_RK = '1 RK',
  ONE_BHK = '1 BHK',
  TWO_BHK = '2 BHK',
  THREE_BHK = '3 BHK',
  FOUR_BHK = '4 BHK',
  FIVE_PLUS_BHK = '5+ BHK'
}

export enum PropertyType {
  FLAT = 'Flat',
  APARTMENT = 'Apartment',
  INDEPENDENT_HOUSE = 'Independent House',
  PG = 'PG'
}

export enum FurnishingType {
  FURNISHED = 'Furnished',
  SEMI_FURNISHED = 'Semi-Furnished',
  UNFURNISHED = 'Unfurnished'
}

export enum FacingDirection {
  EAST = 'East',
  WEST = 'West',
  NORTH = 'North',
  SOUTH = 'South',
  NORTH_EAST = 'North East',
  NORTH_WEST = 'North West',
  SOUTH_EAST = 'South East',
  SOUTH_WEST = 'South West'
}

export enum WaterSupplyType {
  MUNICIPAL = 'Municipal',
  BOREWELL = 'Borewell',
  BOTH = 'Both'
}

export enum PreferredTenants {
  FAMILY = 'Family',
  BACHELORS = 'Bachelors',
  ANYONE = 'Anyone'
}

export enum GenderPreference {
  MALE = 'Male',
  FEMALE = 'Female',
  ANY = 'Any'
}

export interface IFlat extends Document {
  title: string;
  description: string;
  monthlyRent: number;
  depositAmount: number;
  availabilityDate: Date;
  isRentNegotiable: boolean;
  createdBy: IUser['_id'];
  contactNumber: string;
  
  // Location
  address: string;
  city: string;
  locality: string;
  state: string;
  pincode: string;
  landmarks?: string;
  googleMapsLink?: string;
  
  // Property Details
  bhkType: BHKType;
  propertyType: PropertyType;
  floorNumber: number;
  totalFloors: number;
  builtUpArea: number;
  carpetArea: number;
  propertyAge: number;
  facingDirection: FacingDirection;
  
  // Amenities
  furnishingType: FurnishingType;
  hasAC: boolean;
  hasWifi: boolean;
  hasWashingMachine: boolean;
  hasRefrigerator: boolean;
  hasPowerBackup: boolean;
  hasGatedSecurity: boolean;
  hasCCTV: boolean;
  hasElevator: boolean;
  hasParking: boolean;
  hasBalcony: boolean;
  waterSupplyType: WaterSupplyType;
  isPetFriendly: boolean;
  
  // Preferences
  preferredTenants: PreferredTenants;
  genderPreference?: GenderPreference;
  isSmokingAllowed: boolean;
  isNonVegAllowed: boolean;
  
  // Media
  images: string[];
  videoLink?: string;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FlatSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    monthlyRent: {
      type: Number,
      required: [true, 'Please provide monthly rent'],
    },
    depositAmount: {
      type: Number,
      required: [true, 'Please provide deposit amount'],
    },
    availabilityDate: {
      type: Date,
      required: [true, 'Please provide availability date'],
    },
    isRentNegotiable: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user ID'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Please provide contact number'],
    },
    
    // Location
    address: {
      type: String,
      required: [true, 'Please provide address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, 'Please provide locality'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please provide state'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Please provide pincode'],
      trim: true,
    },
    landmarks: {
      type: String,
      trim: true,
    },
    googleMapsLink: {
      type: String,
      trim: true,
    },
    
    // Property Details
    bhkType: {
      type: String,
      enum: Object.values(BHKType),
      required: [true, 'Please provide BHK type'],
    },
    propertyType: {
      type: String,
      enum: Object.values(PropertyType),
      required: [true, 'Please provide property type'],
    },
    floorNumber: {
      type: Number,
      required: [true, 'Please provide floor number'],
    },
    totalFloors: {
      type: Number,
      required: [true, 'Please provide total floors'],
    },
    builtUpArea: {
      type: Number,
      required: [true, 'Please provide built-up area'],
    },
    carpetArea: {
      type: Number,
      required: [true, 'Please provide carpet area'],
    },
    propertyAge: {
      type: Number,
      required: [true, 'Please provide property age'],
    },
    facingDirection: {
      type: String,
      enum: Object.values(FacingDirection),
      required: [true, 'Please provide facing direction'],
    },
    
    // Amenities
    furnishingType: {
      type: String,
      enum: Object.values(FurnishingType),
      required: [true, 'Please provide furnishing type'],
    },
    hasAC: {
      type: Boolean,
      default: false,
    },
    hasWifi: {
      type: Boolean,
      default: false,
    },
    hasWashingMachine: {
      type: Boolean,
      default: false,
    },
    hasRefrigerator: {
      type: Boolean,
      default: false,
    },
    hasPowerBackup: {
      type: Boolean,
      default: false,
    },
    hasGatedSecurity: {
      type: Boolean,
      default: false,
    },
    hasCCTV: {
      type: Boolean,
      default: false,
    },
    hasElevator: {
      type: Boolean,
      default: false,
    },
    hasParking: {
      type: Boolean,
      default: false,
    },
    hasBalcony: {
      type: Boolean,
      default: false,
    },
    waterSupplyType: {
      type: String,
      enum: Object.values(WaterSupplyType),
      required: [true, 'Please provide water supply type'],
    },
    isPetFriendly: {
      type: Boolean,
      default: false,
    },
    
    // Preferences
    preferredTenants: {
      type: String,
      enum: Object.values(PreferredTenants),
      required: [true, 'Please provide preferred tenants'],
    },
    genderPreference: {
      type: String,
      enum: Object.values(GenderPreference),
    },
    isSmokingAllowed: {
      type: Boolean,
      default: false,
    },
    isNonVegAllowed: {
      type: Boolean,
      default: false,
    },
    
    // Media
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
      validate: {
        validator: function(v: string[]) {
          return v.length > 0;
        },
        message: 'Please provide at least one image'
      }
    },
    videoLink: {
      type: String,
      trim: true,
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create indexes for better search performance
FlatSchema.index({ city: 1, locality: 1 });
FlatSchema.index({ bhkType: 1 });
FlatSchema.index({ monthlyRent: 1 });
FlatSchema.index({ createdBy: 1 });
FlatSchema.index({ isActive: 1 });

// Prevent mongoose from creating a new model if it already exists
const Flat: Model<IFlat> = mongoose.models?.Flat || mongoose.model<IFlat>('Flat', FlatSchema);

export default Flat;
