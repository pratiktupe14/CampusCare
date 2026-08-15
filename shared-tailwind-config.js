try {
    tailwind.config = {
        darkMode: "class",
        theme: {
            extend: {
                "colors": {
                    "secondary-fixed": "#ffdad7",
                    "surface-tint": "#bf0715",
                    "error-container": "#ffdad6",
                    "secondary": "#b61722",
                    "on-tertiary-fixed": "#121c2a",
                    "tertiary-fixed": "#d9e3f6",
                    "on-secondary": "#ffffff",
                    "on-primary-fixed": "#410002",
                    "inverse-surface": "#3f2c29",
                    "on-error": "#ffffff",
                    "secondary-container": "#da3437",
                    "tertiary-fixed-dim": "#bdc7d9",
                    "on-error-container": "#93000a",
                    "surface-container": "#ffe9e6",
                    "surface-variant": "#fbdbd7",
                    "background": "#fff8f7",
                    "on-primary-container": "#fff6f5",
                    "on-tertiary": "#ffffff",
                    "surface": "#fff8f7",
                    "outline": "#916f6b",
                    "primary": "#b70011",
                    "surface-dim": "#f3d3cf",
                    "surface-container-low": "#fff0ee",
                    "surface-container-high": "#ffe2de",
                    "on-tertiary-fixed-variant": "#3d4756",
                    "secondary-fixed-dim": "#ffb3ad",
                    "on-surface-variant": "#5c403c",
                    "outline-variant": "#e6bdb8",
                    "surface-container-lowest": "#ffffff",
                    "tertiary": "#505a69",
                    "error": "#ba1a1a",
                    "primary-fixed-dim": "#ffb4ab",
                    "surface-bright": "#fff8f7",
                    "on-tertiary-container": "#f5f7ff",
                    "on-surface": "#281715",
                    "primary-fixed": "#ffdad6",
                    "primary-container": "#dc2626",
                    "inverse-on-surface": "#ffedea",
                    "tertiary-container": "#687283",
                    "on-primary-fixed-variant": "#93000b",
                    "on-background": "#281715",
                    "inverse-primary": "#ffb4ab",
                    "on-secondary-container": "#fffbff",
                    "on-primary": "#ffffff",
                    "surface-container-highest": "#fbdbd7",
                    "on-secondary-fixed": "#410004",
                    "on-secondary-fixed-variant": "#930013",
                    "paper": "#FAF9F6"
                },
                "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
                },
                "spacing": {
                    "container-max": "1024px",
                    "xs": "2px",
                    "lg": "16px",
                    "md": "12px",
                    "gutter": "16px",
                    "sm": "8px",
                    "xl": "24px",
                    "base": "6px",
                    "margin-mobile": "12px"
                },
                "fontFamily": {
                    "sans": ["Roboto", "sans-serif"],
                    "serif": ["'Roboto Slab'", "serif"],
                    "title-md": ["Roboto", "sans-serif"],
                    "headline-lg-mobile": ["Roboto", "sans-serif"],
                    "body-lg": ["Roboto", "sans-serif"],
                    "headline-lg": ["'Roboto Slab'", "serif"],
                    "body-md": ["Roboto", "sans-serif"],
                    "display-lg": ["'Roboto Slab'", "serif"],
                    "label-md": ["Roboto", "sans-serif"]
                },
                "fontSize": {
                    "title-md": ["16px", {"lineHeight": "22px", "fontWeight": "600"}],
                    "headline-lg-mobile": ["18px", {"lineHeight": "24px", "fontWeight": "600"}],
                    "body-lg": ["13px", {"lineHeight": "18px", "fontWeight": "400"}],
                    "headline-lg": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "body-md": ["12px", {"lineHeight": "16px", "fontWeight": "400"}],
                    "display-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "label-md": ["10px", {"lineHeight": "14px", "letterSpacing": "0.05em", "fontWeight": "500"}]
                }
            },
        },
        plugins: [
            function({ addBase }) {
                addBase({
                    '::placeholder': {
                        color: '#9ca3af !important',
                        opacity: '1 !important'
                    }
                })
            }
        ]
    }
} catch(_e) {}
