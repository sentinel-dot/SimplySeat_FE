"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ValidatedInput, ValidationState } from "./validated-input";

export interface AutocompleteInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  validationState?: ValidationState;
  errorMessage?: string;
  warningMessage?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  onSuggestionSelect?: (suggestion: string) => void;
  loading?: boolean;
}

export function AutocompleteInput({
  value,
  onChange,
  suggestions,
  validationState,
  errorMessage,
  warningMessage,
  icon,
  rightElement,
  onSuggestionSelect,
  loading = false,
  className,
  ...props
}: AutocompleteInputProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.filter((s) => s.length > 0);

  React.useEffect(() => {
    setShowDropdown(filteredSuggestions.length > 0 && value.length >= 2);
    setHighlightedIndex(-1);
  }, [filteredSuggestions.length, value]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
          e.preventDefault();
          handleSelectSuggestion(filteredSuggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    onSuggestionSelect?.(suggestion);
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  return (
    <div className="relative w-full">
      <ValidatedInput
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (filteredSuggestions.length > 0 && value.length >= 2) {
            setShowDropdown(true);
          }
        }}
        validationState={validationState}
        errorMessage={errorMessage}
        warningMessage={warningMessage}
        icon={icon}
        rightElement={rightElement}
        className={className}
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        aria-controls={showDropdown ? "autocomplete-list" : undefined}
        aria-activedescendant={
          highlightedIndex >= 0
            ? `autocomplete-option-${highlightedIndex}`
            : undefined
        }
        {...props}
      />

      {showDropdown && filteredSuggestions.length > 0 && (
        <div
          ref={dropdownRef}
          id="autocomplete-list"
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-card shadow-lg"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              id={`autocomplete-option-${index}`}
              type="button"
              role="option"
              aria-selected={index === highlightedIndex}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={cn(
                "w-full px-4 py-3 text-left text-sm transition-colors",
                "min-h-[44px] flex items-center",
                index === highlightedIndex
                  ? "bg-primary/10 text-foreground"
                  : "text-foreground hover:bg-secondary"
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
