<template>
  <div class="sidebar-wrapper" :class="{ 'collapsed': isCollapsed, 'open': isOpen }">
    <!-- Toggle Button -->
    <button class="sidebar-toggle" @click="toggleSidebar">
      <svg class="toggle-icon" viewBox="0 0 24 24" fill="none">
        <path v-if="isCollapsed" d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path v-else d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Sidebar -->
    <nav class="sidebar" :class="{ 'collapsed': isCollapsed }" @click="handleNavClick">
      <!-- Logo Section -->
      <div class="logo-section" @click="isCollapsed = false">
        <h1 class="logo-title" :class="{ 'collapsed': isCollapsed }">
         Cu-Scan<span class="logo-highlight"></span>
        </h1>
      </div>

      <!-- Navigation Links -->
      <div class="nav-links">
        <RouterLink 
          to="/dashboard" 
          class="nav-link"
          :class="{ 
            'active': $route.path === '/dashboard' || $route.path === '/',
            'collapsed': isCollapsed 
          }"
          :title="isCollapsed ? 'Dashboard' : ''"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="nav-text">Dashboard</span>
          <div class="nav-indicator"></div>
        </RouterLink>

        <RouterLink 
          to="/upload" 
          class="nav-link"
          :class="{ 'active': $route.path === '/upload', 'collapsed': isCollapsed }"
          :title="isCollapsed ? 'Upload Image' : ''"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M21 16V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 3V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="nav-text">Upload Image</span>
          <div class="nav-indicator"></div>
        </RouterLink>

        <RouterLink 
          to="/history" 
          class="nav-link"
          :class="{ 'active': $route.path === '/history', 'collapsed': isCollapsed }"
          :title="isCollapsed ? 'History' : ''"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="nav-text">History</span>
          <div class="nav-indicator"></div>
        </RouterLink>

        <RouterLink 
          to="/diseases" 
          class="nav-link"
          :class="{ 'active': $route.path === '/diseases', 'collapsed': isCollapsed }"
          :title="isCollapsed ? 'Disease Info' : ''"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 3C7.5 3 4 6.5 4 11c0 5.5 5.5 9 8 10 2.5-1 8-4.5 8-10 0-4.5-3.5-8-8-8Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="nav-text">Disease Info</span>
          <div class="nav-indicator"></div>
        </RouterLink>

        <RouterLink 
          to="/forum" 
          class="nav-link"
          :class="{ 'active': $route.path === '/forum', 'collapsed': isCollapsed }"
          :title="isCollapsed ? 'Forum' : ''"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="nav-text">Forum</span>
          <div class="nav-indicator"></div>
        </RouterLink>

        <RouterLink 
          to="/profile" 
          class="nav-link"
          :class="{ 'active': $route.path === '/profile', 'collapsed': isCollapsed }"
          :title="isCollapsed ? 'Profile' : ''"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="nav-text">Profile</span>
          <div class="nav-indicator"></div>
        </RouterLink>
      </div>

      <!-- User Profile Section -->
      <div class="user-section" @click="toggleUserMenu">
        <div class="user-avatar">
          <div class="avatar-initials">
            {{ userInitials }}
          </div>
        </div>
        <div class="user-info" :class="{ 'collapsed': isCollapsed }">
          <p class="user-name">{{ userName }}</p>
          <p class="user-email">{{ userEmail }}</p>
        </div>
        <svg 
          class="chevron-icon" 
          :class="{ 'rotated': showUserMenu, 'collapsed': isCollapsed }" 
          viewBox="0 0 24 24" 
          fill="none"
          v-if="!isCollapsed"
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- User Dropdown Menu -->
      <div v-if="showUserMenu && !isCollapsed" class="user-dropdown">
        <div class="dropdown-item" @click="navigateToProfile">
          <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>My Profile</span>
        </div>
        <div class="dropdown-item" @click="openSettings">
          <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.4 15C19.2663 15.3044 19.1306 15.6078 18.9939 15.9102C18.859 16.208 18.723 16.5052 18.5859 16.8017L21.4472 19.6642C21.4515 19.6685 21.4558 19.6728 21.4601 19.6771C21.6685 19.8855 21.6685 20.2258 21.4601 20.4342L20.4342 21.4601C20.2258 21.6685 19.8855 21.6685 19.6771 21.4601C19.6728 21.4558 19.6685 21.4515 19.6642 21.4472L16.8017 18.5859C16.5052 18.723 16.208 18.859 15.9102 18.9939C15.6078 19.1306 15.3044 19.2663 15 19.4C14.6956 19.5337 14.3922 19.6694 14.0898 19.8061C13.792 19.941 13.4948 20.077 13.1983 20.2141L10.3358 23.0766C10.3315 23.0809 10.3272 23.0852 10.3229 23.0895C10.1145 23.2979 9.77418 23.2979 9.56584 23.0895L8.53993 22.0636C8.33159 21.8553 8.33159 21.515 8.53993 21.3066C8.54421 21.3023 8.54848 21.298 8.55275 21.2937L11.4141 18.4324C11.277 18.1359 11.141 17.8387 11.0061 17.5409C10.8694 17.2385 10.7337 16.9351 10.6 16.6307C10.4663 16.3263 10.3306 16.0229 10.1939 15.7205C10.059 15.4227 9.923 15.1255 9.7859 14.829L6.92355 11.9667C6.91927 11.9624 6.915 11.9581 6.91073 11.9538C6.70239 11.7455 6.36207 11.7455 6.15373 11.9538L5.12782 12.9797C4.91948 13.1881 4.91948 13.5284 5.12782 13.7368C5.1321 13.7411 5.13637 13.7454 5.14064 13.7497L8.002 16.6111C8.29851 16.474 8.59569 16.338 8.89353 16.2031C9.19595 16.0664 9.49935 15.9307 9.80375 15.797C10.1082 15.6633 10.4116 15.5276 10.714 15.3909C11.0118 15.256 11.309 15.12 11.6055 14.983L8.74314 12.1206C8.73887 12.1163 8.7346 12.1121 8.73032 12.1078C8.52198 11.8994 8.52198 11.5591 8.73032 11.3508L9.75623 10.3249C9.96457 10.1165 10.3049 10.1165 10.5132 10.3249C10.5175 10.3292 10.5218 10.3335 10.5261 10.3377L13.3874 13.1991C13.5245 13.4956 13.6605 13.7928 13.7954 14.0906C13.9321 14.393 14.0678 14.6964 14.2015 15.0008C14.3352 15.3052 14.4709 15.6086 14.6076 15.911C14.7425 16.2088 14.8785 16.506 15.0156 16.8025L17.8769 19.6639C17.8812 19.6682 17.8855 19.6725 17.8898 19.6768C18.0981 19.8852 18.4384 19.8852 18.6468 19.6768L19.6727 18.6509C19.881 18.4425 19.881 18.1022 19.6727 17.8939C19.6684 17.8896 19.6641 17.8853 19.6598 17.881L16.7985 15.0196C16.502 15.1567 16.2048 15.2927 15.907 15.4276C15.6046 15.5643 15.3012 15.7 14.9968 15.8337C14.6924 15.9674 14.389 16.1031 14.0866 16.2398C13.7888 16.3747 13.4916 16.5107 13.1951 16.6478L16.0564 19.5092C16.0607 19.5135 16.065 19.5178 16.0693 19.5221C16.2776 19.7305 16.2776 20.0708 16.0693 20.2792L15.0434 21.3051C14.835 21.5135 14.4947 21.5135 14.2864 21.3051C14.2821 21.3008 14.2778 21.2965 14.2735 21.2922L11.4122 18.4309C11.2751 18.7274 11.1391 19.0246 11.0042 19.3224C10.8675 19.6248 10.7318 19.9282 10.5981 20.2326C10.4644 20.537 10.3287 20.8404 10.192 21.1428C10.0571 21.4406 9.9211 21.7378 9.784 22.0343L12.6453 24.8957C12.6496 24.9 12.6539 24.9043 12.6582 24.9086C12.8665 25.117 13.2069 25.117 13.4152 24.9086L14.4411 23.8827C14.6495 23.6743 14.6495 23.334 14.4411 23.1257C14.4368 23.1214 14.4326 23.1171 14.4283 23.1128L11.5669 20.2514C11.8634 20.1143 12.1606 19.9783 12.4584 19.8434C12.7608 19.7067 13.0642 19.571 13.3686 19.4373C13.673 19.3036 13.9764 19.1679 14.2788 19.0312C14.5766 18.8963 14.8738 18.7603 15.1703 18.6232L18.0317 21.4846C18.036 21.4889 18.0403 21.4932 18.0446 21.4975C18.2529 21.7059 18.5932 21.7059 18.8016 21.4975L19.8275 20.4716C20.0358 20.2632 20.0358 19.9229 19.8275 19.7146C19.8232 19.7103 19.8189 19.706 19.8146 19.7017L16.9533 16.8403C17.2498 16.7032 17.547 16.5672 17.8448 16.4323C18.1472 16.2956 18.4506 16.1599 18.755 16.0262C19.0594 15.8925 19.3628 15.7568 19.6652 15.6201C19.963 15.4852 20.2602 15.3492 20.5567 15.2121L23.4181 18.0735C23.4224 18.0778 23.4267 18.0821 23.431 18.0864C23.6393 18.2948 23.6393 18.6351 23.431 18.8435L22.4051 19.8694C22.1967 20.0778 21.8564 20.0778 21.6481 19.8694C21.6438 19.8651 21.6395 19.8608 21.6352 19.8565L18.7739 16.9951C18.6368 17.2916 18.5008 17.5888 18.3659 17.8866C18.2292 18.189 18.0935 18.4924 17.9598 18.7968C17.8261 19.1012 17.6904 19.4046 17.5537 19.707C17.4188 20.0048 17.2828 20.302 17.1457 20.5985L20.0071 23.4599C20.0114 23.4642 20.0157 23.4685 20.02 23.4728C20.2283 23.6812 20.2283 24.0215 20.02 24.2299L18.9941 25.2558C18.7857 25.4642 18.4454 25.4642 18.2371 25.2558C18.2328 25.2515 18.2285 25.2472 18.2242 25.2429L15.3629 22.3815C15.0664 22.5186 14.7692 22.6546 14.4714 22.7895C14.169 22.9262 13.8656 23.0619 13.5612 23.1956C13.2568 23.3293 12.9534 23.465 12.651 23.6017C12.3532 23.7366 12.056 23.8726 11.7595 24.0097L14.6209 26.8711C14.6252 26.8754 14.6295 26.8797 14.6338 26.884C14.8421 27.0924 14.8421 27.4327 14.6338 27.6411L13.6079 28.667C13.3995 28.8754 13.0592 28.8754 12.8509 28.667C12.8466 28.6627 12.8423 28.6584 12.838 28.6541L9.97667 25.7927C9.68016 25.9298 9.38298 26.0658 9.08514 26.2007C8.78272 26.3374 8.47932 26.4731 8.17492 26.6068C7.87052 26.7405 7.56712 26.8762 7.26472 27.0129C6.96694 27.1478 6.66976 27.2838 6.37325 27.4209L9.23461 30.2823C9.23888 30.2866 9.24315 30.2909 9.24743 30.2952C9.45577 30.5036 9.45577 30.8439 9.24743 31.0523L8.22152 32.0782C8.01318 32.2866 7.67286 32.2866 7.46452 32.0782C7.46025 32.0739 7.45598 32.0696 7.4517 32.0653L4.59034 29.2039C4.29383 29.341 3.99665 29.477 3.69881 29.6119C3.39639 29.7486 3.09299 29.8843 2.78859 30.018C2.48419 30.1517 2.18079 30.2874 1.87839 30.4241C1.58061 30.559 1.28343 30.695 0.98692 30.8321L3.84828 33.6935C3.85255 33.6978 3.85682 33.7021 3.8611 33.7064C4.06944 33.9148 4.06944 34.2551 3.8611 34.4635L2.83519 35.4894C2.62685 35.6978 2.28653 35.6978 2.07819 35.4894C2.07392 35.4851 2.06965 35.4808 2.06538 35.4765L-0.79598 32.6151C-1.09249 32.7522 -1.38967 32.8882 -1.68751 33.0231C-1.98993 33.1598 -2.29333 33.2955 -2.59773 33.4292C-2.90213 33.5629 -3.20553 33.6986 -3.50793 33.8353C-3.80571 33.9702 -4.10289 34.1062 -4.3994 34.2433L-1.53804 37.1047C-1.53377 37.109 -1.5295 37.1133 -1.52522 37.1176C-1.31688 37.326 -1.31688 37.6663 -1.52522 37.8747L-2.55113 38.9006C-2.75947 39.109 -3.09979 39.109 -3.30813 38.9006C-3.3124 38.8963 -3.31667 38.892 -3.32095 38.8877L-6.18231 36.0263C-6.47882 36.1634 -6.776 36.2994 -7.07384 36.4343C-7.37626 36.571 -7.67966 36.7067 -7.98406 36.8404C-8.28846 36.9741 -8.59186 37.1098 -8.89426 37.2465C-9.19204 37.3814 -9.48922 37.5174 -9.78573 37.6545L-6.92437 40.5159C-6.9201 40.5202 -6.91583 40.5245 -6.91156 40.5288C-6.70322 40.7372 -6.70322 41.0775 -6.91156 41.2859L-7.93747 42.3118C-8.14581 42.5202 -8.48613 42.5202 -8.69447 42.3118C-8.69874 42.3075 -8.70301 42.3032 -8.70729 42.2989L-11.5686 39.4375C-11.8652 39.5746 -12.1623 39.7106 -12.4602 39.8455C-12.7626 39.9822 -13.066 40.1179 -13.3704 40.2516C-13.6748 40.3853 -13.9782 40.521 -14.2806 40.6577C-14.5784 40.7926 -14.8756 40.9286 -15.1721 41.0657L-12.3107 43.9271C-12.3065 43.9314 -12.3022 43.9357 -12.2979 43.94C-12.0896 44.1484 -12.0896 44.4887 -12.2979 44.6971L-13.3238 45.723C-13.5322 45.9314 -13.8725 45.9314 -14.0808 45.723C-14.0851 45.7187 -14.0894 45.7144 -14.0937 45.7101L-16.955 42.8487C-17.2515 42.9858 -17.5487 43.1218 -17.8466 43.2567C-18.149 43.3934 -18.4524 43.5291 -18.7568 43.6628C-19.0612 43.7965 -19.3646 43.9322 -19.667 44.0689C-19.9648 44.2038 -20.262 44.3398 -20.5585 44.4769L-17.6971 47.3383C-17.6929 47.3426 -17.6886 47.3469 -17.6843 47.3512C-17.476 47.5596 -17.476 47.8999 -17.6843 48.1083L-18.7102 49.1342C-18.9186 49.3426 -19.2589 49.3426 -19.4672 49.1342C-19.4715 49.1299 -19.4758 49.1256 -19.4801 49.1213L-22.3414 46.2599C-22.6379 46.397 -22.9351 46.533 -23.233 46.6679C-23.5354 46.8046 -23.8388 46.9403 -24.1432 47.074C-24.4476 47.2077 -24.751 47.3434 -25.0534 47.4801C-25.3512 47.615 -25.6484 47.751 -25.9449 47.8881L-23.0835 50.7495C-23.0793 50.7538 -23.075 50.7581 -23.0707 50.7624C-22.8624 50.9708 -22.8624 51.3111 -23.0707 51.5195L-24.0966 52.5454C-24.305 52.7538 -24.6453 52.7538 -24.8536 52.5454C-24.8579 52.5411 -24.8622 52.5368 -24.8665 52.5325L-27.7279 49.6711C-28.0244 49.8082 -28.3216 49.9442 -28.6194 50.0791C-28.9218 50.2158 -29.2252 50.3515 -29.5296 50.4852C-29.834 50.6189 -30.1374 50.7546 -30.4398 50.8913C-30.7376 51.0262 -31.0348 51.1622 -31.3313 51.2993L-28.4699 54.1607C-28.4657 54.165 -28.4614 54.1693 -28.4571 54.1736C-28.2488 54.382 -28.2488 54.7223 -28.4571 54.9307L-29.483 55.9566C-29.6914 56.165 -30.0317 56.165 -30.24 55.9566C-30.2443 55.9523 -30.2486 55.948 -30.2529 55.9437L-33.1143 53.0823C-33.4108 53.2194 -33.708 53.3554 -34.0058 53.4903C-34.3082 53.627 -34.6116 53.7627 -34.916 53.8964C-35.2204 54.0301 -35.5238 54.1658 -35.8262 54.3025C-36.124 54.4374 -36.4212 54.5734 -36.7177 54.7105L-33.8563 57.5719C-33.8521 57.5762 -33.8478 57.5805 -33.8435 57.5848C-33.6352 57.7932 -33.6352 58.1335 -33.8435 58.3419L-34.8694 59.3678C-35.0778 59.5762 -35.4181 59.5762 -35.6264 59.3678C-35.6307 59.3635 -35.635 59.3592 -35.6393 59.3549L-38.5007 56.4935C-38.7972 56.6306 -39.0944 56.7666 -39.3922 56.9015C-39.6946 57.0382 -39.998 57.1739 -40.3024 57.3076C-40.6068 57.4413 -40.9102 57.577 -41.2126 57.7137C-41.5104 57.8486 -41.8076 57.9846 -42.1041 58.1217L-39.2427 60.9831C-39.2385 60.9874 -39.2342 60.9917 -39.2299 60.996C-39.0216 61.2044 -39.0216 61.5447 -39.2299 61.7531L-40.2558 62.779C-40.4642 62.9874 -40.8045 62.9874 -41.0128 62.779C-41.0171 62.7747 -41.0214 62.7704 -41.0257 62.7661L-43.8871 59.9047C-44.1836 60.0418 -44.4808 60.1778 -44.7786 60.3127C-45.081 60.4494 -45.3844 60.5851 -45.6888 60.7188C-45.9932 60.8525 -46.2966 60.9882 -46.599 61.1249C-46.8968 61.2598 -47.194 61.3958 -47.4905 61.5329L-44.6291 64.3943C-44.6249 64.3986 -44.6206 64.4029 -44.6163 64.4072C-44.408 64.6156 -44.408 64.9559 -44.6163 65.1643L-45.6422 66.1902C-45.8506 66.3986 -46.1909 66.3986 -46.3992 66.1902C-46.4035 66.1859 -46.4078 66.1816 -46.4121 66.1773L-49.2735 63.3159C-49.57 63.453 -49.8672 63.589 -50.165 63.7239C-50.4674 63.8606 -50.7708 63.9963 -51.0752 64.13C-51.3796 64.2637 -51.683 64.3994 -51.9854 64.5361C-52.2832 64.671 -52.5804 64.807 -52.8769 64.9441L-50.0155 67.8055C-50.0113 67.8098 -50.007 67.8141 -50.0027 67.8184C-49.7944 68.0268 -49.7944 68.3671 -50.0027 68.5755L-51.0286 69.6014C-51.237 69.8098 -51.5773 69.8098 -51.7856 69.6014C-51.7899 69.5971 -51.7942 69.5928 -51.7985 69.5885L-54.6599 66.7271C-54.9564 66.8642 -55.2536 66.9002 -55.5514 66.9351Z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <span>Settings</span>
        </div>
        <div class="dropdown-item logout" @click="handleLogout">
          <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Logout</span>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const emit = defineEmits(['close', 'openSettings'])

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)
const isCollapsed = ref(false)

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && window.innerWidth < 768) {
      isCollapsed.value = false
    }
  }
)

const toggleSidebar = () => {
  if (window.innerWidth < 768) {
    emit('close')
    return
  }

  isCollapsed.value = !isCollapsed.value
  showUserMenu.value = false
}

// User data
const userName = computed(() => {
  return authStore.user?.displayName || 
         authStore.user?.email?.split('@')[0] || 
         'User'
})

const userEmail = computed(() => {
  return authStore.user?.email || ''
})

const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const handleNavClick = (event) => {
  if (event.target.closest('a')) {
    emit('close')
  }
}

const toggleUserMenu = () => {
  if (!isCollapsed.value) {
    showUserMenu.value = !showUserMenu.value
  }
}

const navigateToProfile = () => {
  router.push('/profile')
  showUserMenu.value = false
}

const openSettings = () => {
  showUserMenu.value = false
  emit('openSettings')
}

const handleLogout = async () => {
  try {
    showUserMenu.value = false
    console.log('Attempting logout...')
    
    await authStore.logout()
    
    console.log('Logout successful, redirecting to login...')
    
    setTimeout(() => {
      router.push('/login')
    }, 100)
    
  } catch (error) {
    console.error('Logout error:', error)
    router.push('/login')
  }
}

// Close dropdown when clicking outside
const closeUserMenu = (event) => {
  if (!event.target.closest('.user-section') && !event.target.closest('.user-dropdown')) {
    showUserMenu.value = false
  }
}

// Listen for clicks outside
onMounted(() => {
  document.addEventListener('click', closeUserMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
})
</script>

<style scoped>
.sidebar-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  width: 260px;
  transition: width 0.3s ease, transform 0.25s ease;
  background: transparent;
}

.sidebar-wrapper.collapsed {
  width: 80px;
}

.sidebar-toggle {
  position: absolute;
  top: 22px;
  right: -14px;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1002;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
  transition: transform 0.25s ease, background 0.25s ease;
}

.sidebar-toggle:hover {
  transform: scale(1.05);
  background: white;
}

.toggle-icon {
  width: 16px;
  height: 16px;
  color: #0f172a;
}

.sidebar {
  height: 100%;
  width: 100%;
  background: linear-gradient(180deg, rgba(6, 78, 59, 0.98), rgba(8, 86, 63, 0.96));
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.logo-section {
  padding-bottom: 28px;
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

.logo-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.2;
  white-space: nowrap;
  opacity: 1;
  letter-spacing: -0.03em;
}

.logo-title.collapsed {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.logo-highlight {
  color: rgba(255, 255, 255, 0.85);
}

.nav-links {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 8px;
  overflow-y: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  text-decoration: none;
  border-radius: 18px;
  transition: all 0.25s ease;
  position: relative;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-text {
  transition: opacity 0.25s ease;
  opacity: 1;
}

.sidebar.collapsed .nav-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.nav-indicator {
  position: absolute;
  right: 14px;
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #34d399, #10b981);
  border-radius: 999px;
  opacity: 0;
  transition: all 0.25s ease;
  transform: scaleX(0);
}

.nav-link.active .nav-indicator {
  opacity: 1;
  transform: scaleX(1);
}

.sidebar.collapsed .nav-indicator {
  right: 10px;
}

.nav-link[title] {
  position: relative;
}

.nav-link[title]::after {
  content: attr(title);
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 23, 42, 0.95);
  color: white;
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1001;
  pointer-events: none;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
}

.nav-link[title]:hover::after {
  opacity: 1;
  visibility: visible;
}

.user-section {
  margin-top: auto;
  padding: 18px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
}

.sidebar.collapsed .user-section {
  padding: 18px 10px;
  justify-content: center;
}

.avatar-initials {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
}

.user-info {
  flex: 1;
  min-width: 0;
  transition: opacity 0.25s ease;
}

.user-info.collapsed {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.user-name {
  font-weight: 700;
  color: #ecffef;
  font-size: 0.95rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.9);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.chevron-icon.collapsed {
  display: none;
}

.user-dropdown {
  position: absolute;
  bottom: 72px;
  left: 14px;
  right: 14px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.16);
  border: 1px solid rgba(15, 23, 42, 0.08);
  z-index: 1001;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  color: #344054;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(16, 185, 129, 0.08);
  color: #0f172a;
}

.dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #b91c1c;
}

.dropdown-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.nav-links::-webkit-scrollbar {
  width: 6px;
}

.nav-links::-webkit-scrollbar-track {
  background: transparent;
}

.nav-links::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.16);
  border-radius: 999px;
}

.nav-links::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.28);
}

@media (max-width: 768px) {
  .sidebar-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    width: min(100vw, 320px);
    max-width: 320px;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    height: 100vh;
  }

  .sidebar-wrapper.open {
    transform: translateX(0);
    box-shadow: 4px 0 34px rgba(15, 23, 42, 0.18);
  }

  .sidebar-wrapper.collapsed {
    width: min(100vw, 320px);
  }

  .sidebar-wrapper.open.collapsed {
    width: min(100vw, 320px);
  }

  .sidebar {
    height: 100vh;
  }

  .sidebar-toggle {
    display: none;
  }
}
</style>
