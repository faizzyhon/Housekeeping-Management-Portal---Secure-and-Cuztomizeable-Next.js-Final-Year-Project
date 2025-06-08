"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, AlertTriangle, TrendingDown, Plus, Minus, ShoppingCart, BarChart3 } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Supply {
  id: string
  name: string
  category: string
  currentStock: number
  minThreshold: number
  maxCapacity: number
  unit: string
  costPerUnit: number
  lastRestocked: string
  usage: {
    daily: number
    weekly: number
    monthly: number
  }
}

export default function SupplyManagement() {
  const [supplies, setSupplies] = useLocalStorage<Supply[]>("supplies-data", [
    {
      id: "1",
      name: "Toilet Paper",
      category: "Bathroom",
      currentStock: 45,
      minThreshold: 20,
      maxCapacity: 100,
      unit: "rolls",
      costPerUnit: 1.25,
      lastRestocked: "2 days ago",
      usage: { daily: 8, weekly: 56, monthly: 240 },
    },
    {
      id: "2",
      name: "Towels",
      category: "Bathroom",
      currentStock: 12,
      minThreshold: 15,
      maxCapacity: 50,
      unit: "pieces",
      costPerUnit: 8.5,
      lastRestocked: "1 week ago",
      usage: { daily: 3, weekly: 21, monthly: 90 },
    },
    {
      id: "3",
      name: "Bed Sheets",
      category: "Bedroom",
      currentStock: 28,
      minThreshold: 25,
      maxCapacity: 75,
      unit: "sets",
      costPerUnit: 15.0,
      lastRestocked: "3 days ago",
      usage: { daily: 4, weekly: 28, monthly: 120 },
    },
    {
      id: "4",
      name: "All-Purpose Cleaner",
      category: "Cleaning",
      currentStock: 8,
      minThreshold: 10,
      maxCapacity: 30,
      unit: "bottles",
      costPerUnit: 3.75,
      lastRestocked: "5 days ago",
      usage: { daily: 2, weekly: 14, monthly: 60 },
    },
    {
      id: "5",
      name: "Vacuum Bags",
      category: "Equipment",
      currentStock: 25,
      minThreshold: 15,
      maxCapacity: 50,
      unit: "pieces",
      costPerUnit: 2.0,
      lastRestocked: "1 week ago",
      usage: { daily: 1, weekly: 7, monthly: 30 },
    },
    {
      id: "6",
      name: "Disinfectant",
      category: "Cleaning",
      currentStock: 6,
      minThreshold: 12,
      maxCapacity: 40,
      unit: "bottles",
      costPerUnit: 4.25,
      lastRestocked: "4 days ago",
      usage: { daily: 3, weekly: 21, monthly: 90 },
    },
  ])

  const updateStock = (id: string, change: number) => {
    setSupplies((prev) =>
      prev.map((supply) =>
        supply.id === id
          ? {
              ...supply,
              currentStock: Math.max(0, Math.min(supply.maxCapacity, supply.currentStock + change)),
            }
          : supply,
      ),
    )
  }

  const getStockStatus = (supply: Supply) => {
    const percentage = (supply.currentStock / supply.maxCapacity) * 100
    if (supply.currentStock <= supply.minThreshold) return "critical"
    if (percentage <= 30) return "low"
    if (percentage <= 60) return "medium"
    return "good"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "low":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "good":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const criticalSupplies = supplies.filter((supply) => getStockStatus(supply) === "critical")
  const lowSupplies = supplies.filter((supply) => getStockStatus(supply) === "low")

  return (
    <div className="space-y-6">
      {/* Alert Cards */}
      {(criticalSupplies.length > 0 || lowSupplies.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criticalSupplies.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  Critical Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-3">{criticalSupplies.length} item(s) need immediate restocking</p>
                <div className="space-y-2">
                  {criticalSupplies.map((supply) => (
                    <div key={supply.id} className="text-sm">
                      <span className="font-medium">{supply.name}</span>: {supply.currentStock} {supply.unit} remaining
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {lowSupplies.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <TrendingDown className="w-5 h-5" />
                  Low Stock Warning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-700 mb-3">{lowSupplies.length} item(s) running low</p>
                <div className="space-y-2">
                  {lowSupplies.map((supply) => (
                    <div key={supply.id} className="text-sm">
                      <span className="font-medium">{supply.name}</span>: {supply.currentStock} {supply.unit} remaining
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Supply Inventory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Supply Inventory
          </CardTitle>
          <CardDescription>Monitor and manage housekeeping supplies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supplies.map((supply) => {
              const status = getStockStatus(supply)
              const percentage = (supply.currentStock / supply.maxCapacity) * 100

              return (
                <Card key={supply.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{supply.name}</CardTitle>
                      <Badge className={getStatusColor(status)}>{status}</Badge>
                    </div>
                    <CardDescription>{supply.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Stock Level</span>
                        <span className="text-sm text-muted-foreground">
                          {supply.currentStock}/{supply.maxCapacity} {supply.unit}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Min: {supply.minThreshold}</span>
                        <span>Max: {supply.maxCapacity}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Cost per unit:</span>
                        <span className="font-medium">${supply.costPerUnit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last restocked:</span>
                        <span className="text-muted-foreground">{supply.lastRestocked}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily usage:</span>
                        <span className="text-muted-foreground">
                          {supply.usage.daily} {supply.unit}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(supply.id, -1)}
                        disabled={supply.currentStock <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium flex-1 text-center">
                        {supply.currentStock} {supply.unit}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(supply.id, 1)}
                        disabled={supply.currentStock >= supply.maxCapacity}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {status === "critical" && (
                      <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Order Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Usage Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Usage Analytics
          </CardTitle>
          <CardDescription>Supply consumption patterns and forecasting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                ${supplies.reduce((acc, supply) => acc + supply.usage.monthly * supply.costPerUnit, 0).toFixed(0)}
              </div>
              <p className="text-sm text-gray-600">Monthly Supply Cost</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {supplies.filter((supply) => getStockStatus(supply) === "good").length}
              </div>
              <p className="text-sm text-gray-600">Well Stocked Items</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {supplies.filter((supply) => ["critical", "low"].includes(getStockStatus(supply))).length}
              </div>
              <p className="text-sm text-gray-600">Items Need Attention</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-4">Top Usage Items</h4>
            <div className="space-y-3">
              {supplies
                .sort((a, b) => b.usage.daily - a.usage.daily)
                .slice(0, 5)
                .map((supply, index) => (
                  <div key={supply.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{supply.name}</p>
                        <p className="text-sm text-gray-600">{supply.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {supply.usage.daily} {supply.unit}/day
                      </p>
                      <p className="text-sm text-gray-600">
                        ${(supply.usage.daily * supply.costPerUnit).toFixed(2)}/day
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
