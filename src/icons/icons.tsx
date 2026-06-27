import { createIcon } from './createIcon'

// Navigation / system
export const HomeIcon = createIcon(
  <>
    <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
  </>,
  'HomeIcon',
)
export const SearchIcon = createIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </>,
  'SearchIcon',
)
export const SettingsIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </>,
  'SettingsIcon',
)
export const GridIcon = createIcon(
  <>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </>,
  'GridIcon',
)
export const CompassIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z" />
  </>,
  'CompassIcon',
)
export const ClockIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>,
  'ClockIcon',
)
export const BellIcon = createIcon(
  <>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </>,
  'BellIcon',
)
export const GlobeIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </>,
  'GlobeIcon',
)
export const LockIcon = createIcon(
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>,
  'LockIcon',
)
export const CubeIcon = createIcon(
  <>
    <path d="M21 8 12 3 3 8l9 5 9-5z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </>,
  'CubeIcon',
)

// Actions
export const PlusIcon = createIcon(<path d="M12 5v14M5 12h14" />, 'PlusIcon')
export const MinusIcon = createIcon(<path d="M5 12h14" />, 'MinusIcon')
export const CheckIcon = createIcon(<path d="M20 6 9 17l-5-5" />, 'CheckIcon')
export const EllipsisIcon = createIcon(
  <g fill="currentColor" stroke="none">
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </g>,
  'EllipsisIcon',
)
export const UploadIcon = createIcon(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5" />
    <path d="M12 3v12" />
  </>,
  'UploadIcon',
)
export const EditIcon = createIcon(
  <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
  </>,
  'EditIcon',
)
export const SendIcon = createIcon(
  <>
    <path d="M22 2 11 13" />
    <path d="M22 2l-7 20-4-9-9-4z" />
  </>,
  'SendIcon',
)
export const MicIcon = createIcon(
  <>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <path d="M12 17v4" />
  </>,
  'MicIcon',
)
export const ArrowRightIcon = createIcon(
  <>
    <path d="M5 12h14" />
    <path d="m13 5 7 7-7 7" />
  </>,
  'ArrowRightIcon',
)
export const ArrowUpRightIcon = createIcon(
  <>
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </>,
  'ArrowUpRightIcon',
)
export const ChevronDownIcon = createIcon(<path d="m6 9 6 6 6-6" />, 'ChevronDownIcon')
export const ChevronRightIcon = createIcon(<path d="m9 6 6 6-6 6" />, 'ChevronRightIcon')
export const CloseIcon = createIcon(<path d="M18 6 6 18M6 6l12 12" />, 'CloseIcon')

// Content / media
export const PlayIcon = createIcon(
  <path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none" />,
  'PlayIcon',
)
export const ImageIcon = createIcon(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </>,
  'ImageIcon',
)
export const VideoIcon = createIcon(
  <>
    <path d="M23 7l-7 5 7 5z" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </>,
  'VideoIcon',
)
export const CodeIcon = createIcon(
  <>
    <path d="m16 18 6-6-6-6" />
    <path d="m8 6-6 6 6 6" />
  </>,
  'CodeIcon',
)
export const SparkleIcon = createIcon(
  <path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z" />,
  'SparkleIcon',
)
export const HashIcon = createIcon(
  <>
    <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
  </>,
  'HashIcon',
)
export const WalletIcon = createIcon(
  <>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
  </>,
  'WalletIcon',
)

// Social / people
export const UserIcon = createIcon(
  <>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>,
  'UserIcon',
)
export const HeartIcon = createIcon(
  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z" />,
  'HeartIcon',
)
export const ChatIcon = createIcon(
  <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />,
  'ChatIcon',
)
export const FolderIcon = createIcon(
  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
  'FolderIcon',
)

// Theme
export const SunIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>,
  'SunIcon',
)
export const MoonIcon = createIcon(
  <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" fill="currentColor" stroke="none" />,
  'MoonIcon',
)
