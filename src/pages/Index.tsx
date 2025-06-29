import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Karol-Core AGI Platform
      </h1>

      {/* Core Functionalities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="card-enhanced">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Chat Interface</h2>
            <p className="text-sm text-slate-400">
              Interact with the AGI through a conversational interface.
            </p>
            <Link to="/chat-test" className="inline-block mt-4 text-blue-500 hover:underline">
              Go to Chat
            </Link>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Data Management</h2>
            <p className="text-sm text-slate-400">
              Manage and visualize system data, agent states, and decision logs.
            </p>
            <a href="#" className="inline-block mt-4 text-blue-500 hover:underline">
              Explore Data
            </a>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Agent Control</h2>
            <p className="text-sm text-slate-400">
              Monitor and control individual agents, their behaviors, and interactions.
            </p>
            <a href="#" className="inline-block mt-4 text-blue-500 hover:underline">
              Control Agents
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Extended Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Link to="/extended-agi-panel">
          <Card className="card-enhanced hover-gradient-scale cursor-pointer">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-4 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white mb-2">Extended AGI Panel</h3>
              <p className="text-slate-400 text-sm">Advanced development modules & intelligence extensions</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/platform-settings">
          <Card className="card-enhanced hover-gradient-scale cursor-pointer">
            <CardContent className="p-6 text-center">
              <Settings className="h-8 w-8 mx-auto mb-4 text-green-400" />
              <h3 className="text-lg font-semibold text-white mb-2">Platform Settings</h3>
              <p className="text-slate-400 text-sm">System configuration, tools & advanced management</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="card-enhanced opacity-75">
          <CardContent className="p-6 text-center">
            <Settings className="h-8 w-8 mx-auto mb-4 text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">Full Armor Platform</h3>
            <p className="text-slate-500 text-sm">Complete AGI orchestration (Coming Soon)</p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-slate-500">
        <p className="text-sm">
          Karol-Core AGI Platform | © 2024 All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
