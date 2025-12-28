'use client';

import * as React from 'react';
import { Drawer, DrawerContent as BaseDrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface HeaderDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  drawerBtn: () => React.ReactNode;
  children: React.ReactNode;
}

export function HeaderDrawer({ open, setOpen, drawerBtn, children }: HeaderDrawerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <Drawer 
      open={open} 
      onOpenChange={setOpen}
      direction={isDesktop ? 'right' : 'bottom'}
    >
      <DrawerTrigger asChild>
        {drawerBtn()}
      </DrawerTrigger>
      {children}
    </Drawer>
  );
}

interface DrawerContentProps {
  className?: string;
  children: React.ReactNode;
}

export function DrawerContent({ className, children }: DrawerContentProps) {
  return (
    <BaseDrawerContent 
      className={cn(
        'max-h-[95vh] overflow-auto',
        className
      )}
    >
      {children}
    </BaseDrawerContent>
  );
}