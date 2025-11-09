
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trees, ArrowRight, TreeDeciduous, Users, Vote } from 'lucide-react';
import * as React from 'react';

const AnimatedIcon = ({ icon: Icon, delay, text }: { icon: React.ElementType, delay: number, text: string }) => (
  <div
    className="flex flex-col items-center gap-2 opacity-0"
    style={{ animation: `fadeInUp 0.6s ease-out ${delay}s forwards` }}
  >
    <Icon className="w-12 h-12 text-primary" />
    <span className="text-sm font-semibold text-center">{text}</span>
  </div>
);

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8 text-center overflow-hidden">
       <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
      `}</style>

      <div className="max-w-4xl w-full">
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-4 md:p-8">
            <div className="flex justify-center mb-6 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out 0.1s forwards' }}>
              <Trees className="w-20 h-20 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out 0.3s forwards' }}>
              Welcome to Forest Insights
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0" style={{ animation: 'fadeInUp 0.5s ease-out 0.5s forwards' }}>
              Ever wondered how many small decisions can lead to one great one? Let's explore the Random Forest algorithm in a simple, visual way.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 items-start">
              <AnimatedIcon icon={TreeDeciduous} delay={0.8} text="Start with a single 'tree' making a simple decision." />
              
              <div className="flex justify-center items-center h-full opacity-0" style={{ animation: 'fadeInUp 0.6s ease-out 1.0s forwards' }}>
                <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />
              </div>

              <AnimatedIcon icon={Users} delay={1.2} text="Build a 'forest' from many diverse trees." />
              
               <div className="flex justify-center items-center h-full opacity-0" style={{ animation: 'fadeInUp 0.6s ease-out 1.4s forwards' }}>
                <ArrowRight className="w-8 h-8 text-muted-foreground hidden md:block" />
              </div>
            </div>

            <div className="flex justify-center mb-12 opacity-0" style={{ animation: 'fadeInUp 0.6s ease-out 1.6s forwards' }}>
                <AnimatedIcon icon={Vote} delay={0} text="Let them vote to make a final, smarter prediction!" />
            </div>

            <div className="opacity-0" style={{ animation: 'scaleIn 0.5s ease-out 2.0s forwards' }}>
                <Button size="lg" onClick={onGetStarted}>
                    Let's Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </main>
  );
}
