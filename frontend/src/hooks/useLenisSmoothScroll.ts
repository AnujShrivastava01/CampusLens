import { useContext } from 'react';
import { LenisSmoothScrollContext } from '../contexts/LenisSmoothScrollContext';

export const useLenisSmoothScroll = () => useContext(LenisSmoothScrollContext);
