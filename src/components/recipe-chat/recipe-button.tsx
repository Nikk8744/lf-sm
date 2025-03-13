import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface RecipeButtonProps {
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
  }>;
}

export function RecipeButton({ orderId }: RecipeButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(`/orders/${orderId}/recipes`)}
      variant="outline"
      size="sm"
    >
      View Recipes
    </Button>
  );
}