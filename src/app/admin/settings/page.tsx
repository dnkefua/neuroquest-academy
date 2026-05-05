'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Shield, Bell, Palette, Database, Globe, Key } from 'lucide-react';
import styles from '../admin.module.css';

const tabs = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div>
      <h1>Settings Page</h1>
    </div>
  );
}
