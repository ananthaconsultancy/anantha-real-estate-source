import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validateName = (name: string) => {
    // allow only letters (upper/lower) and spaces
    const re = /^[A-Za-z\s]+$/;
    return re.test(name.trim());
  };

  const validateEmail = (email: string) => {
    const allowedRe = /^[A-Za-z0-9@.]+$/; // only letters, numbers, @ and . allowed
    const structureRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // basic email structure check
    const v = email.trim();
    return allowedRe.test(v) && structureRe.test(v);
  };

  const validatePhone = (phone: string) => {
    // allow digits, spaces, plus, hyphen and parentheses
    const allowedRe = /^[0-9+\s\-()]+$/;
    const digitsOnly = phone.replace(/\D/g, "");
    // require at least 7 digits (basic phone length check)
    return allowedRe.test(phone.trim()) && digitsOnly.length >= 7;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validate name before submitting
    if (!validateName(formData.name)) {
      setNameError("Please enter the correct Name");
      return;
    }
    // validate email only if provided (optional field)
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError("Please enter the correct email");
      return;
    }
    // validate phone before submitting
    if (formData.phone && !validatePhone(formData.phone)) {
      setPhoneError("Please enter the correct Phone Number");
      return;
    }

    try {
      // send form data to SheetDB
      const response = await fetch("https://sheetdb.io/api/v1/5t6g1w4g6wj80", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              message: formData.message,
              timestamp: new Date().toLocaleString(),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      trackEvent("contact_form_submit", { form_name: "general_contact" });

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
      setNameError("");
      setEmailError("");
      setPhoneError("");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Satyanarayana Puram Center, Nellore, Andhra Pradesh 524002",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 63029 66604",
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "jvk.aconsultancy@gmail.com",
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "Mon - Sat: 9:00 AM - 7:00 PM",
    },
  ];

  return (
    <section id="contact" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <span className="text-accent font-medium text-sm tracking-wider uppercase mb-4 block">
              Contact Us
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Get In Touch
              <span className="text-accent block">With Us</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 font-body">
              Ready to find your dream property? Contact us today and let our
              experts guide you through every step.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <info.icon className="text-accent" size={22} />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground mb-1">
                      {info.title}
                    </h4>
                    <p className="text-muted-foreground text-sm font-body">
                      {info.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, name: val });
                    if (val.trim() === "" || validateName(val)) {
                      setNameError("");
                    } else {
                      setNameError("Please enter the correct Name");
                    }
                  }}
                  aria-invalid={nameError ? "true" : "false"}
                  aria-describedby={nameError ? "name-error" : undefined}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all font-body"
                  placeholder="Your name"
                  required
                />
                {nameError && (
                  <p id="name-error" className="mt-2 text-sm text-red-500">
                    {nameError}
                  </p>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                      value={formData.email}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, email: val });
                        if (val.trim() === "" || validateEmail(val)) {
                          setEmailError("");
                        } else {
                          setEmailError("Please enter the correct email");
                        }
                      }}
                    aria-invalid={emailError ? "true" : "false"}
                    aria-describedby={emailError ? "email-error" : undefined}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all font-body"
                    placeholder="your@email.com"
                  />
                  {emailError && (
                    <p id="email-error" className="mt-2 text-sm text-red-500">
                      {emailError}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, phone: val });
                        if (val.trim() === "" || validatePhone(val)) {
                          setPhoneError("");
                        } else {
                          setPhoneError("Please enter the correct Phone Number");
                        }
                      }}
                      aria-invalid={phoneError ? "true" : "false"}
                      aria-describedby={phoneError ? "phone-error" : undefined}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all font-body"
                      placeholder="+91 63029 66604"
                  />
                    {phoneError && (
                      <p id="phone-error" className="mt-2 text-sm text-red-500">{phoneError}</p>
                    )}
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none font-body"
                  placeholder="Tell us about your property requirements..."
                  required
                />
              </div>
              <Button type="submit" variant="brand" size="lg" className="w-full">
                Send Message
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
