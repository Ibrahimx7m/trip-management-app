'use client';

import { ThemeToggle } from '@/components/features/theme-toggle';
import NotificationCenter from '@/components/features/notification-center';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Menu, Search } from 'lucide-react';
import {
  ClipboardList,
  Home,
  Map as MapIcon,
  Navigation,
  Route,
  Truck,
  User,
  Users,
} from 'lucide-react';
import React from 'react';
import MobileSidebar from '../sidebar/mobile-sidebar';
import { useT } from '@/app/providers/lang-provider';

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const t = useT();

  const quickSettings = [
    { id: 'home', Icon: Home, label: t.navbar.quickSettings.home },
    { id: 'trips-summary', Icon: Route, label: t.navbar.quickSettings.tripsSummary },
    { id: 'list', Icon: ClipboardList, label: t.navbar.quickSettings.list },
    { id: 'driver-list', Icon: Users, label: t.navbar.quickSettings.driverList },
  ];

  const managementOptions = [
    { id: 'fleet-management', Icon: Truck, label: t.navbar.management.fleetManagement },
    { id: 'driver-management', Icon: User, label: t.navbar.management.driverManagement },
    { id: 'trip-management', Icon: MapIcon, label: t.navbar.management.tripManagement },
    { id: 'route-management', Icon: Navigation, label: t.navbar.management.routeManagement },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 bg-card border-b border-border shadow-sm animate-slideInFromTop">
        {/* Left side - Mobile menu and search */}
        <div className="flex items-center gap-4 animate-slideInFromLeft">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant={'ghost'}
                  className="text-sm text-muted-foreground px-2.5 py-1 md:hidden hover:animate-wiggle transition-all duration-300"
                >
                  <Menu className="size-5 text-muted-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 animate-slideInFromLeft">
                <MobileSidebar />
              </SheetContent>
            </Sheet>
            <Button
              variant={'ghost'}
              className="text-sm text-muted-foreground px-2.5 py-1 flex flex-row gap-1 items-center hover:scale-105 transition-all duration-300"
              onClick={() => setOpen(true)}
            >
              <Search className="size-5 text-foreground mr-2 animate-pulse" />
              <span className="hidden md:flex">{t.navbar.searchButton}</span>
            </Button>
          </div>
        </div>
        {/* Right side - Notifications, Theme Toggle and Sign Out */}
        <div className="flex items-center ml-4 gap-2 animate-slideInFromRight">
          <div className="animate-scaleIn" style={{ animationDelay: '0.1s' }}>
            <NotificationCenter />
          </div>
          <div className="animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-sm font-medium animate-scaleIn hover:scale-105 transition-all duration-300"
            style={{ animationDelay: '0.3s' }}
          >
            <LogOut className="w-4 h-4" />
            {t.common.signOut}
          </Button>
        </div>
      </nav>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full h-full sm:max-w-xl sm:h-2/3 p-0">
          <div className="flex flex-col w-full">
            {/* Search Input */}
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                className="flex h-16 w-full rounded-md bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0"
                placeholder={t.navbar.searchPlaceholder}
                aria-label="Search"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] h-full w-full place-content-center gap-8">
              {/* Quick Settings Section */}
              <div className="flex flex-col items-start pl-16">
                <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground">
                  {t.navbar.quickSettingsHeader}
                </h4>
                <div className="space-y-2 text-muted-foreground">
                  {quickSettings.map(({ id, Icon, label }) => (
                    <Button
                      key={id}
                      variant="ghost"
                      className="w-full justify-start gap-3 pl-0 hover:bg-background hover:text-accent-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Separator */}
              <Separator
                className="hidden md:flex h-full"
                orientation="vertical"
              />
              <Separator
                className="flex md:hidden w-96 mx-auto"
                orientation="horizontal"
              />

              {/* Management Section */}
              <div className="flex flex-col items-start pl-16 md:pl-0">
                <h4 className="mb-4 text-sm font-medium leading-none text-muted-foreground">
                  {t.navbar.managementHeader}
                </h4>
                <div className="space-y-2 text-muted-foreground">
                  {managementOptions.map(({ id, Icon, label }) => (
                    <Button
                      key={id}
                      variant="ghost"
                      className="w-full justify-start gap-3 pl-0 hover:bg-background hover:text-accent-foreground"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
