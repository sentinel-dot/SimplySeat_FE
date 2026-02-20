"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { sendContactForm } from "@/lib/api/contact";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein").max(100),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  subject: z.string().min(3, "Betreff muss mindestens 3 Zeichen lang sein").max(200),
  message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen lang sein").max(5000),
  website: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { customer } = useCustomerAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  // Pre-fill name and email if user is logged in
  useEffect(() => {
    if (customer) {
      setValue("name", customer.name);
      setValue("email", customer.email);
    }
  }, [customer, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const result = await sendContactForm(data);
      
      if (result.success) {
        toast.success("Nachricht gesendet!", {
          description: "Wir melden uns in Kürze bei Ihnen.",
        });
        // Only reset subject and message, keep name and email if logged in
        setValue("subject", "");
        setValue("message", "");
        if (!customer) {
          reset();
        }
      } else {
        toast.error("Fehler beim Senden", {
          description: result.error || "Bitte versuchen Sie es später erneut.",
        });
      }
    } catch (error) {
      toast.error("Fehler", {
        description: "Ein unerwarteter Fehler ist aufgetreten.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot field - hidden from users, catches bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          {...register("website")}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Name <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder="Ihr vollständiger Name"
          disabled={isSubmitting || !!customer}
        />
        {errors.name && (
          <p className="mt-1.5 text-sm text-destructive">{errors.name.message}</p>
        )}
        {customer && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Aus Ihrem Kundenkonto übernommen
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          E-Mail <span className="text-destructive">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder="ihre.email@beispiel.de"
          disabled={isSubmitting || !!customer}
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-destructive">{errors.email.message}</p>
        )}
        {customer && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Aus Ihrem Kundenkonto übernommen
          </p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
          Betreff <span className="text-destructive">*</span>
        </label>
        <input
          id="subject"
          type="text"
          {...register("subject")}
          className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          placeholder="Worum geht es?"
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="mt-1.5 text-sm text-destructive">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Nachricht <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          {...register("message")}
          className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
          placeholder="Ihre Nachricht an uns..."
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="mt-1.5 text-sm text-destructive">{errors.message.message}</p>
        )}
        <p className="mt-1.5 text-xs text-muted-foreground">
          Mindestens 10 Zeichen
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Wird gesendet...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Nachricht senden
          </>
        )}
      </button>
    </form>
  );
}
