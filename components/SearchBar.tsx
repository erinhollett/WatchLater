import React from "react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "1.5rem",
      }}
    >
      <input
        type="text"
        placeholder="Type a movie title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "0.5rem 0.75rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "1rem",
        }}
      />
    </div>
  );
}