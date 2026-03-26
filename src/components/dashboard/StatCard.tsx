import React from 'react';
import { Card, CardContent } from '../Card';
import type { Trend } from '../../types/traffic';
import { TrendingUp, TrendingDown } from 'lucide-react';
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: Trend;
  color: string;
}
export function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#707070] dark:text-muted-foreground truncate">
              {title}
            </p>
            <p className="mt-1.5 text-2xl font-bold text-foreground tracking-tight">
              {value}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              {trend.isPositive ?
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> :

              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              }
              <span
                className={`text-xs font-medium ${trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-xs text-[#707070] dark:text-muted-foreground">
                vs last hour
              </span>
            </div>
          </div>
          <div
            className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl"
            style={{
              backgroundColor: `${color}18`
            }}>
            
            <div
              style={{
                color
              }}>
              
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>);

}