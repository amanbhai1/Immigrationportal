import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Globe,
  Shield,
  FileText,
  Calculator,
  Upload,
  Folder,
  CheckSquare,
  LogIn,
  Star,
  Phone,
  Mail,
  MapPin,
  Award,
  TrendingUp,
  Heart,
  Zap,
  Target,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: FileText,
      title: "Smart Document Management",
      description:
        "Organize, upload, and track all your immigration documents in one secure, cloud-based platform with automated reminders.",
      color: "bg-blue-500",
    },
    {
      icon: Calculator,
      title: "CRS Score Calculator",
      description:
        "Get real-time calculations of your Comprehensive Ranking System score with detailed breakdowns and improvement suggestions.",
      color: "bg-green-500",
    },
    {
      icon: CheckSquare,
      title: "Progress Tracking",
      description:
        "Monitor your application progress with our interactive checklist and timeline, ensuring you never miss a deadline.",
      color: "bg-purple-500",
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description:
        "Access professional immigration advice and support throughout your journey from certified immigration consultants.",
      color: "bg-orange-500",
    },
    {
      icon: Shield,
      title: "Secure & Confidential",
      description:
        "Bank-level security ensures your sensitive information is protected with end-to-end encryption and privacy compliance.",
      color: "bg-red-500",
    },
    {
      icon: Globe,
      title: "Multi-Program Support",
      description:
        "Support for all major Canadian immigration programs including Express Entry, PNP, Family Class, and more.",
      color: "bg-indigo-500",
    },
  ];

  const stats = [
    {
      label: "Success Rate",
      value: "95%",
      icon: CheckCircle,
      description: "Applications approved",
    },
    {
      label: "Average Processing",
      value: "6 months",
      icon: Clock,
      description: "Faster than industry average",
    },
    {
      label: "Happy Clients",
      value: "12,000+",
      icon: Users,
      description: "Successful immigrations",
    },
    {
      label: "Countries Served",
      value: "85+",
      icon: Globe,
      description: "Worldwide reach",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      country: "Hong Kong",
      program: "Express Entry - FSW",
      rating: 5,
      text: "The portal made my immigration process so much smoother. The CRS calculator helped me understand exactly what I needed to improve, and the document management saved me countless hours.",
      image: "👩‍💼",
    },
    {
      name: "Ahmed Hassan",
      country: "UAE",
      program: "Provincial Nominee Program",
      rating: 5,
      text: "Outstanding service! The checklist feature ensured I never missed any requirements. The expert guidance was invaluable throughout my PNP application.",
      image: "👨‍💻",
    },
    {
      name: "Maria Rodriguez",
      country: "Mexico",
      program: "Canadian Experience Class",
      rating: 5,
      text: "I was overwhelmed by the immigration process until I found this portal. Everything is organized, clear, and the progress tracking kept me motivated.",
      image: "👩‍🎓",
    },
    {
      name: "David Kim",
      country: "South Korea",
      program: "Start-up Visa",
      rating: 5,
      text: "The platform's comprehensive approach and attention to detail made all the difference. I received my PR faster than expected!",
      image: "👨‍🚀",
    },
  ];

  const services = [
    {
      icon: Target,
      title: "Eligibility Assessment",
      description:
        "Comprehensive evaluation of your profile to determine the best immigration pathway",
      features: [
        "Detailed scoring analysis",
        "Program recommendations",
        "Improvement strategies",
      ],
    },
    {
      icon: FileText,
      title: "Application Preparation",
      description:
        "Complete assistance with preparing and organizing your immigration application",
      features: ["Document review", "Form completion", "Quality assurance"],
    },
    {
      icon: TrendingUp,
      title: "Profile Enhancement",
      description:
        "Strategic guidance to improve your CRS score and application strength",
      features: [
        "Language training tips",
        "Education upgrades",
        "Work experience optimization",
      ],
    },
    {
      icon: Heart,
      title: "Family Applications",
      description:
        "Specialized support for family class sponsorship and dependent applications",
      features: [
        "Relationship documentation",
        "Financial requirements",
        "Timeline planning",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">
                  Immigration Portal
                </span>
                <p className="text-xs text-blue-600 font-medium">
                  Your Path to Canada
                </p>
              </div>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-lg">
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 text-sm font-semibold">
              🇨🇦 Trusted by 12,000+ successful immigrants
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Your Journey to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                Canada
              </span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
                Starts Here
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Transform your Canadian immigration dreams into reality with our
              comprehensive digital platform. Streamline applications, track
              progress, and get expert guidance every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                asChild
                className="bg-blue-600 hover:bg-blue-700 shadow-xl text-lg px-8 py-4 h-auto"
              >
                <Link to="/login" className="flex items-center gap-3">
                  <Zap className="h-5 w-5" />
                  Start Your Journey Today
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-blue-200 text-blue-700 hover:bg-blue-50 text-lg px-8 py-4 h-auto"
              >
                <Link to="/application-category">Explore Programs</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6 text-center">
                    <div className="bg-blue-100 p-3 rounded-xl mb-4 inline-block">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {stat.description}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              Our Services
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Immigration Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial assessment to final approval, we provide end-to-end
              support for your Canadian immigration journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-1">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">
              Platform Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools and features designed to simplify
              your immigration process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white"
                >
                  <CardHeader className="pb-4">
                    <div
                      className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800">
              Client Success Stories
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real people who achieved their Canadian
              immigration dreams through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      {testimonial.image}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {testimonial.text}
                  </p>

                  <Badge
                    variant="outline"
                    className="text-xs text-blue-600 border-blue-200"
                  >
                    {testimonial.program}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <Badge className="mb-4 bg-purple-100 text-purple-800">
                Get In Touch
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Ready to Start Your Immigration Journey?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Have questions about your immigration options? Our expert team
                is here to help guide you through every step of the process.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Phone Support
                    </h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Email Support
                    </h4>
                    <p className="text-gray-600">
                      support@immigrationportal.com
                    </p>
                    <p className="text-sm text-gray-500">
                      24/7 response within 2 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Office Location
                    </h4>
                    <p className="text-gray-600">
                      123 Immigration Ave, Suite 456
                    </p>
                    <p className="text-gray-600">Toronto, ON M5V 3A1, Canada</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Input placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input type="email" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country of Residence
                  </label>
                  <Input placeholder="United States" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Immigration Program Interest
                  </label>
                  <Input placeholder="Express Entry, PNP, Family Class, etc." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us about your immigration goals and any questions you have..."
                    rows={4}
                  />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                  Send Message
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Take the First Step Towards Your Canadian Dream
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of successful applicants who have used our platform
            to navigate their immigration journey. Your new life in Canada is
            just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-lg px-8 py-4 h-auto"
            >
              <Link to="/login" className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Start Your Application
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-blue-700 text-lg px-8 py-4 h-auto"
            >
              <Link to="/application-category">Learn More About Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2.5 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">Immigration Portal</span>
                  <p className="text-sm text-gray-400">Your Path to Canada</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering your journey to Canada with secure, comprehensive
                immigration management tools and expert guidance every step of
                the way.
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  ICCRC Certified
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Bank-Level Security
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/application-category"
                    className="hover:text-white transition-colors"
                  >
                    Programs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/crs-score"
                    className="hover:text-white transition-colors"
                  >
                    CRS Calculator
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-800 mb-8" />

          <div className="text-center text-gray-400">
            <p>
              &copy; 2024 Immigration Portal. All rights reserved. | Licensed by
              ICCRC
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
