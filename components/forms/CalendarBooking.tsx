'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CalendarBookingProps {
  onMeetingChange: (meetingData: MeetingRequest | null) => void;
  disabled?: boolean;
  className?: string;
}

interface MeetingRequest {
  preferredDate: string;
  preferredTime: string;
  duration: number;
  type: 'video' | 'phone' | 'in-person';
  description?: string;
  timezone?: string;
}

const CalendarBooking: React.FC<CalendarBookingProps> = ({
  onMeetingChange,
  disabled = false,
  className = ''
}) => {
  const [meetingEnabled, setMeetingEnabled] = useState(false);
  const [meetingData, setMeetingData] = useState<MeetingRequest>({
    preferredDate: '',
    preferredTime: '',
    duration: 60,
    type: 'video',
    description: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Time slots (business hours)
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  // Duration options
  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  // Meeting type options
  const meetingTypes = [
    {
      value: 'video',
      label: 'Video Call',
      icon: <Video className="h-4 w-4" />,
      description: 'Google Meet or Zoom'
    },
    {
      value: 'phone',
      label: 'Phone Call',
      icon: <Phone className="h-4 w-4" />,
      description: 'Traditional phone call'
    },
    {
      value: 'in-person',
      label: 'In-Person',
      icon: <MapPin className="h-4 w-4" />,
      description: 'At our office or your location'
    }
  ];

  // Validate meeting data
  const validateMeetingData = (data: MeetingRequest): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!data.preferredDate) {
      newErrors.preferredDate = 'Please select a preferred date';
    } else {
      const selectedDate = new Date(data.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.preferredDate = 'Please select a future date';
      }
    }

    if (!data.preferredTime) {
      newErrors.preferredTime = 'Please select a preferred time';
    }

    return newErrors;
  };

  // Handle meeting toggle
  const handleMeetingToggle = (enabled: boolean) => {
    setMeetingEnabled(enabled);
    if (enabled) {
      const validationErrors = validateMeetingData(meetingData);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length === 0) {
        onMeetingChange(meetingData);
      }
    } else {
      setErrors({});
      onMeetingChange(null);
    }
  };

  // Handle field changes
  const handleFieldChange = (field: keyof MeetingRequest, value: string | number) => {
    const updatedData = { ...meetingData, [field]: value };
    setMeetingData(updatedData);

    if (meetingEnabled) {
      const validationErrors = validateMeetingData(updatedData);
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length === 0) {
        onMeetingChange(updatedData);
      } else {
        onMeetingChange(null);
      }
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Meeting Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Schedule a Meeting</CardTitle>
            </div>
            <Button
              type="button"
              variant={meetingEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => handleMeetingToggle(!meetingEnabled)}
              disabled={disabled}
            >
              {meetingEnabled ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Meeting Scheduled
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Add Meeting
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        {meetingEnabled && (
          <CardContent className="space-y-6">
            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Preferred Date */}
              <div className="space-y-2">
                <Label htmlFor="preferredDate">
                  Preferred Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={meetingData.preferredDate}
                  onChange={(e) => handleFieldChange('preferredDate', e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  disabled={disabled}
                  className={errors.preferredDate ? 'border-red-500' : ''}
                />
                {errors.preferredDate && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.preferredDate}
                  </div>
                )}
              </div>

              {/* Preferred Time */}
              <div className="space-y-2">
                <Label htmlFor="preferredTime">
                  Preferred Time <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={meetingData.preferredTime}
                  onValueChange={(value) => handleFieldChange('preferredTime', value)}
                  disabled={disabled}
                >
                  <SelectTrigger className={errors.preferredTime ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {time}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.preferredTime && (
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    {errors.preferredTime}
                  </div>
                )}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Meeting Duration</Label>
              <Select
                value={meetingData.duration.toString()}
                onValueChange={(value) => handleFieldChange('duration', parseInt(value))}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Meeting Type */}
            <div className="space-y-3">
              <Label>Meeting Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {meetingTypes.map((type) => (
                  <Card
                    key={type.value}
                    className={`cursor-pointer transition-colors ${
                      meetingData.type === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !disabled && handleFieldChange('type', type.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-2 rounded-full ${
                          meetingData.type === type.value ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {type.icon}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{type.label}</p>
                          <p className="text-xs text-gray-500">{type.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="meetingDescription">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="meetingDescription"
                placeholder="Any specific topics you'd like to discuss or special requirements..."
                value={meetingData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                disabled={disabled}
                rows={3}
              />
            </div>

            {/* Meeting Summary */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-2">Meeting Summary</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>
                    <strong>Date:</strong> {
                      meetingData.preferredDate 
                        ? new Date(meetingData.preferredDate).toLocaleDateString()
                        : 'Not selected'
                    }
                  </p>
                  <p>
                    <strong>Time:</strong> {meetingData.preferredTime || 'Not selected'}
                  </p>
                  <p>
                    <strong>Duration:</strong> {
                      durationOptions.find(d => d.value === meetingData.duration)?.label
                    }
                  </p>
                  <p>
                    <strong>Type:</strong> {
                      meetingTypes.find(t => t.value === meetingData.type)?.label
                    }
                  </p>
                  {meetingData.description && (
                    <p>
                      <strong>Notes:</strong> {meetingData.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timezone Info */}
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
              <p>
                <strong>Timezone:</strong> {meetingData.timezone}
              </p>
              <p className="mt-1">
                All times are displayed in your local timezone. We'll send calendar invitations 
                with the correct timezone information.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default CalendarBooking;