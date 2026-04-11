import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewFormProps {
  onSubmit: (rating: number, text: string) => Promise<boolean>;
  submitting: boolean;
}

const ReviewForm = ({ onSubmit, submitting }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    const success = await onSubmit(rating, text);
    if (success) {
      setRating(0);
      setText("");
    }
  };

  return (
    <div className="p-4 bg-muted rounded-lg space-y-3">
      <h4 className="font-semibold text-foreground text-sm">Write a Review</h4>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setRating(s)}
            onMouseEnter={() => setHoverRating(s)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors cursor-pointer ${
                s <= (hoverRating || rating)
                  ? "fill-secondary text-secondary"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-xs text-muted-foreground ml-2">{rating}/5</span>
        )}
      </div>
      <Textarea
        placeholder="Share your experience with this seller..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="bg-background border-border text-foreground resize-none"
        rows={3}
        maxLength={500}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{text.length}/500</span>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={submitting || !rating || !text.trim()}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2"
        >
          <Send className="h-3 w-3" />
          {submitting ? "Posting..." : "Post Review"}
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
