import { Stack, Typography, Button } from "@archway/valet";
import type { MaterialType } from "./types";
import { fieldLabelSx, toggleButtonSx, wrapRowSx } from "./styles";

interface MaterialTypeToggleProps {
  materialType: MaterialType;
  onChange: (type: MaterialType) => void;
}

export function MaterialTypeToggle({
  materialType,
  onChange,
}: MaterialTypeToggleProps) {
  return (
    <Stack gap={0} sx={{ padding: "2px 4px 6px 4px" }}>
      <Typography variant="body" sx={fieldLabelSx}>
        Material Type
      </Typography>
      <Stack direction="row" gap={0} sx={{ padding: 0, ...wrapRowSx }}>
        {(["standard", "physical", "shader"] as const).map((type) => (
          <Button
            key={type}
            size="sm"
            sx={{
              ...toggleButtonSx,
              backgroundColor:
                materialType === type
                  ? "rgba(75, 208, 210, 0.3)"
                  : "transparent",
            }}
            onClick={() => onChange(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}
