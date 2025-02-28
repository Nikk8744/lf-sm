import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Leaf,
  Users,
  Sprout,
  ShieldCheck,
  TrendingUp,
  Globe,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      {/* Hero Section */}
      <section className="py-20 bg-[#222831]">
        <div className="container mx-auto px-4">
          <div className="text-center text-white space-y-4 max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">About Us</Badge>
            <h1 className="text-5xl font-bold mb-4">Our Story</h1>
            <p className="text-xl">
              Connecting local farmers with conscious consumers since 2020
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center text-3xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Farm Mart, we believe in creating a sustainable food system that 
                benefits both farmers and consumers. Our platform serves as a bridge, 
                connecting local farmers directly with consumers who value fresh, 
                sustainably grown produce.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-600" />
                  For Farmers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We empower local farmers by providing them with a direct channel 
                  to market their produce, ensuring fair prices and sustainable 
                  farming practices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  For Consumers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We deliver fresh, locally sourced produce right to your doorstep, 
                  making it easy to support local agriculture while enjoying the 
                  highest quality foods.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Leaf className="h-6 w-6 text-green-600" />,
                title: "Sustainability",
                description: "Promoting eco-friendly farming practices",
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
                title: "Quality",
                description: "Ensuring premium produce quality",
              },
              {
                icon: <TrendingUp className="h-6 w-6 text-yellow-600" />,
                title: "Growth",
                description: "Supporting farmer development",
              },
              {
                icon: <Globe className="h-6 w-6 text-purple-600" />,
                title: "Impact",
                description: "Creating sustainable communities",
              },
            ].map((value, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-center">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-[#EEEEEE]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Founder & CEO",
                description: "Leading our mission to transform local agriculture",
              },
              {
                name: "Michael Chen",
                role: "Head of Operations",
                description: "Ensuring smooth delivery of farm-fresh produce",
              },
              {
                name: "Emma Williams",
                role: "Farmer Relations",
                description: "Building strong partnerships with local farmers",
              },
            ].map((member, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-center">{member.name}</CardTitle>
                  <p className="text-center text-muted-foreground font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#222831] text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "100+", label: "Local Farmers" },
              { number: "10K+", label: "Happy Customers" },
              { number: "50+", label: "Cities Served" },
              { number: "95%", label: "Customer Satisfaction" },
            ].map((stat, index) => (
              <Card key={index} className="bg-transparent border-none">
                <CardContent className="text-center pt-6">
                  <p className="text-4xl font-bold mb-2 text-white">{stat.number}</p>
                  <p className="text-gray-300">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-3xl">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <MapPin className="h-6 w-6 text-[#48b5bb]" />
                  <p className="text-muted-foreground">123 Farm Street, City</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Mail className="h-6 w-6 text-[#48b5bb]" />
                  <p className="text-muted-foreground">contact@farmmart.com</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Phone className="h-6 w-6 text-[#48b5bb]" />
                  <p className="text-muted-foreground">+1 234 567 8900</p>
                </div>
              </div>
              <Separator className="my-8" />
              <div className="text-center">
                <Link href="/contact">
                  <Button className="bg-[#48b5bb] hover:bg-[#48b5bb]/90">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default AboutUsPage