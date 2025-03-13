import { useToast } from "@/hooks/use-toast";
import { Calendar, Loader2, MessageSquare, Star, ThumbsUp, User } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema } from "@/lib/validations";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { z } from "zod";
import { Review } from "../../types";

const ProductReview = ({ productId }: { productId: string }) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  // const [rating, setRating] = useState(0);
  // const [comment, setComment] = useState("");
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Zod.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productId,
      rating: 5,
      comment: '',
    },
  });
  const watchRating = form.watch("rating");
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reviews?productId=${productId}`);
        const data = await response.json();

        if (session?.user.id) {
            const userReview = data.find(
                (review: Review) => review.userId === session.user.id
            );
            if (userReview) {
                setExistingReview(userReview);
                // setRating(userReview.rating);
                // setComment(userReview.comment);
                form.reset({
                    productId,
                    rating: userReview.rating,
                    comment: userReview.comment || '',
                  });
            }
        }
        if (response.ok) {
          setReviews(data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load reviews",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to load reviews: ${error}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, toast, session?.user, form]);


  const onSubmit = async (formData: z.infer<typeof reviewSchema>) => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a review",
        variant: "destructive",
      });
      return;
    }

    // const reviewData = { rating, comment, productId };
    setSubmitting(true);
    try {
      const response = existingReview
        ? await fetch(`/api/reviews`, {
            method: "POST",
            body: JSON.stringify({
              ...formData,
              id: existingReview.id, // update the existing review
            }),
            headers: {
              "Content-Type": "application/json",
            },
          })
        : await fetch(`/api/reviews`, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
            },
          });

      const responseData = await response.json();
      if (response.ok) {
        toast({
          title: "Review Submitted",
          description: existingReview
            ? "Your review has been updated"
            : "Your review has been added",
          variant: "default",
        });
        // Reset form and state
        form.reset({ productId, rating: 5, comment: '' });
        setExistingReview(null);
        
        // Re-fetch reviews
        const updatedReviewsResponse = await fetch(
          `/api/reviews?productId=${productId}`
        );
        const updatedReviews = await updatedReviewsResponse.json();
        setReviews(updatedReviews);
      } else {
        toast({
          title: "Error",
          description: responseData.error || "Failed to submit your review",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit your review",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 mt-12 bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold">Product Reviews</h2>
        </div>
      </div>

      <Separator />

      {session?.user ? (
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="text-lg font-semibold flex items-center gap-2 mb-4">
              <ThumbsUp className="h-5 w-5 text-blue-500" />
              <span>Your Review</span>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-8 w-8 cursor-pointer transition-colors duration-200 ${
                              field.value >= star ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill={field.value >= star ? "currentColor" : "none"}
                            onClick={() => field.onChange(star)}
                            onMouseEnter={() => {
                              const stars = document.querySelectorAll('.star-rating');
                              stars.forEach((s, i) => {
                                if (i < star) {
                                  s.classList.add('text-yellow-400');
                                  s.classList.remove('text-gray-300');
                                }
                              });
                            }}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          {field.value === 1 && "Poor"}
                          {field.value === 2 && "Fair"}
                          {field.value === 3 && "Good"}
                          {field.value === 4 && "Very Good"}
                          {field.value === 5 && "Excellent"}
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Share your experience with this product..."
                          className="w-full min-h-[120px] resize-none border-gray-300 focus:border-green-500 focus:ring-green-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={submitting || !watchRating || !form.getValues("comment")}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {existingReview ? "Updating..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      {existingReview ? "Update Review" : "Submit Review"}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-gray-200 shadow-sm bg-gray-100">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Please sign in to leave a review</p>
            <Button className="mt-4 bg-green-600 hover:bg-green-700">Sign In</Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <div className="text-lg font-semibold flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <span>Customer Reviews</span>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Avatar className="h-10 w-10 bg-green-100 text-green-600">
                        <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium flex items-center gap-1">
                            <User className="h-4 w-4 text-gray-500" />
                            {review.userName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                review.rating >= star
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill={review.rating >= star ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {review.comment}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReview;
