"use client";

import React, { InputHTMLAttributes, forwardRef } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  helpText?: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  (
    {
      id,
      label,
      error,
      helpText,
      type = 'text',
      multiline = false,
      rows = 3,
      required = false,
      icon,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputId = `form-field-${id}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helpTextId = helpText ? `${inputId}-help` : undefined;
    const descriptionIds = [errorId, helpTextId].filter(Boolean).join(' ');

    const inputClasses = `
      w-full px-4 py-3 rounded-lg
      ${error
        ? 'border border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500'
        : 'border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
      }
      ${icon ? 'pl-10' : ''}
      focus:outline-none transition-colors
      ${className}
    `;

    return (
      <div className="mb-4">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          {multiline ? (
            <textarea
              id={inputId}
              ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
              rows={rows}
              aria-invalid={error ? true : false}
              aria-describedby={descriptionIds || undefined}
              className={inputClasses}
              required={required}
              {...props}
            />
          ) : (
            <input
              id={inputId}
              ref={ref as React.ForwardedRef<HTMLInputElement>}
              type={type}
              aria-invalid={error ? true : false}
              aria-describedby={descriptionIds || undefined}
              className={inputClasses}
              required={required}
              {...props}
            />
          )}
        </div>

        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {helpText && !error && (
          <p id={helpTextId} className="mt-1 text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
