import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";

const Claims = () => {
  const [amount, setAmount] = useState("");
  const [template, setTemplate] = useState("");
  const [projectName, setProjectName] = useState("");
  
  const generateClaim = () => {
    if (!amount || !template || !projectName) {
      alert("Please fill in all fields");
      return;
    }
    alert(`Progress claim generated:\nProject: ${projectName}\nAmount: $${amount}\nTemplate: ${template}`);
    // Reset form
    setAmount("");
    setTemplate("");
    setProjectName("");
  };

  const lenderTemplates = [
    "ANZ Construction Loan",
    "CBA Development Finance",
    "NAB Property Finance", 
    "Westpac Business Loan",
    "Custom Template"
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Progress Claim
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Project Name</label>
            <Input
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Claim Amount</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Lender Template</label>
            <Select onValueChange={setTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select lender template" />
              </SelectTrigger>
              <SelectContent>
                {lenderTemplates.map((tmpl) => (
                  <SelectItem key={tmpl} value={tmpl}>
                    {tmpl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={generateClaim} 
            className="w-full bg-green-700 hover:bg-green-800"
          >
            Generate Claim Document
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Claims;