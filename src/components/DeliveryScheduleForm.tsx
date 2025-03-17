'use client';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const deliveryFormSchema = z.object({
  preferredDay: z.string().min(1, "Please select a delivery day"),
  preferredTime: z.string().min(1, "Please select a delivery time"),
  address: z.string().min(5, "Please enter your delivery address"),
  instructions: z.string().optional(),
});

type DeliveryFormData = z.infer<typeof deliveryFormSchema>;

interface DeliveryScheduleFormProps {
  onSubmit: (data: DeliveryFormData) => void;
  isLoading?: boolean;
  defaultValues?: DeliveryFormData;
}

const DELIVERY_DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

const DELIVERY_TIMES = [
  '9:00 AM - 12:00 PM',
  '12:00 PM - 3:00 PM',
  '3:00 PM - 6:00 PM'
];

export default function DeliveryScheduleForm({ onSubmit, isLoading, defaultValues }: DeliveryScheduleFormProps) {
    const form = useForm<DeliveryFormData>({
        resolver: zodResolver(deliveryFormSchema),
        defaultValues: {
          preferredDay: defaultValues?.preferredDay || '',
          preferredTime: defaultValues?.preferredTime || '',
          address: defaultValues?.address || '',
          instructions: defaultValues?.instructions || '',
        },
      });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="preferredDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Delivery Day</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DELIVERY_DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Time Slot</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DELIVERY_TIMES.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your delivery address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Delivery Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add any special delivery instructions..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Continue to Payment'}
        </Button>
      </form>
    </Form>
  );
}