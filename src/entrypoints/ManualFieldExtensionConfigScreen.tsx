import React, { useState, useEffect } from "react";
import type { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import {
  Canvas,
  Button,
  ButtonGroupButton,
  Section,
} from "datocms-react-ui";
import { getUserParameters } from "../utils/userSettings";
import { getFieldParameters } from "../utils/fieldParameters";
import type { FieldParameters } from "../utils/fieldParameters";
import * as styling from "./ManualFieldExtensionConfigScreen.module.css";

type Props = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

const ManualFieldExtensionConfigScreen: React.FC<Props> = ({ ctx }) => {
  const [stylesOpen, setStylesOpen] = useState(true);
  const [marksOpen, setMarksOpen] = useState(true);

  const globalParams = getUserParameters(ctx.plugin.attributes.parameters);
  const allStyleSlugs = globalParams.customStyles.map((s) => s.slug);
  const allMarkSlugs = globalParams.customMarks.map((m) => m.slug);

  const initialFieldParams = getFieldParameters(ctx.parameters);
  const [allowedStyles, setAllowedStyles] = useState<string[]>(
    initialFieldParams ? initialFieldParams.allowedStyles : allStyleSlugs,
  );
  const [allowedMarks, setAllowedMarks] = useState<string[]>(
    initialFieldParams ? initialFieldParams.allowedMarks : allMarkSlugs,
  );

  // Persist "all pre-selected" state when the addon is freshly attached
  useEffect(() => {
    if (!initialFieldParams) {
      ctx.setParameters({
        allowedStyles: allStyleSlugs,
        allowedMarks: allMarkSlugs,
      } satisfies FieldParameters);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (next: FieldParameters) => {
    ctx.setParameters(next);
  };

  const toggleStyle = (slug: string) => {
    const next = allowedStyles.includes(slug)
      ? allowedStyles.filter((s) => s !== slug)
      : [...allowedStyles, slug];
    setAllowedStyles(next);
    save({ allowedStyles: next, allowedMarks });
  };

  const toggleMark = (slug: string) => {
    const next = allowedMarks.includes(slug)
      ? allowedMarks.filter((m) => m !== slug)
      : [...allowedMarks, slug];
    setAllowedMarks(next);
    save({ allowedStyles, allowedMarks: next });
  };

  const selectAllStyles = () => {
    setAllowedStyles(allStyleSlugs);
    save({ allowedStyles: allStyleSlugs, allowedMarks });
  };

  const removeAllStyles = () => {
    setAllowedStyles([]);
    save({ allowedStyles: [], allowedMarks });
  };

  const selectAllMarks = () => {
    setAllowedMarks(allMarkSlugs);
    save({ allowedStyles, allowedMarks: allMarkSlugs });
  };

  const removeAllMarks = () => {
    setAllowedMarks([]);
    save({ allowedStyles, allowedMarks: [] });
  };

  return (
    <Canvas ctx={ctx}>
      <Section
        title="Allowed Styles"
        collapsible={{ isOpen: stylesOpen, onToggle: () => setStylesOpen((v) => !v) }}
      >
        <div className={styling.sectionContent}>
          {globalParams.customStyles.length === 0 ? (
            <p className={styling.empty}>
              No custom styles configured. Add some in the plugin settings.
            </p>
          ) : (
            <>
              <div className={styling.pillActions}>
                <div className={styling.pillRow}>
                  {globalParams.customStyles.map((style) => (
                    <ButtonGroupButton
                      key={style.slug}
                      selected={allowedStyles.includes(style.slug)}
                      onClick={() => toggleStyle(style.slug)}
                    >
                      {style.title}
                    </ButtonGroupButton>
                  ))}
                </div>
                <div className={styling.pillBulkActions}>
                  <Button buttonType="muted" buttonSize="xs" onClick={selectAllStyles}>
                    Select all
                  </Button>
                  <Button buttonType="muted" buttonSize="xs" onClick={removeAllStyles}>
                    Remove all
                  </Button>
                </div>
              </div>
              <p className={styling.empty}>
                Configure which formatting options will be provided to editors.
              </p>
            </>
          )}
        </div>
      </Section>

      <Section
        title="Allowed Marks"
        collapsible={{ isOpen: marksOpen, onToggle: () => setMarksOpen((v) => !v) }}
      >
        <div className={styling.sectionContent}>
          {globalParams.customMarks.length === 0 ? (
            <p className={styling.empty}>
              No custom marks configured. Add some in the plugin settings.
            </p>
          ) : (
            <>
              <div className={styling.pillActions}>
                <div className={styling.pillRow}>
                  {globalParams.customMarks.map((mark) => (
                    <ButtonGroupButton
                      key={mark.slug}
                      selected={allowedMarks.includes(mark.slug)}
                      onClick={() => toggleMark(mark.slug)}
                    >
                      {mark.title}
                    </ButtonGroupButton>
                  ))}
                </div>
                <div className={styling.pillBulkActions}>
                  <Button buttonType="muted" buttonSize="xs" onClick={selectAllMarks}>
                    Select all
                  </Button>
                  <Button buttonType="muted" buttonSize="xs" onClick={removeAllMarks}>
                    Remove all
                  </Button>
                </div>
              </div>
              <p className={styling.empty}>
                Configure which formatting options will be provided to editors.
              </p>
            </>
          )}
        </div>
      </Section>
    </Canvas>
  );
};

export default ManualFieldExtensionConfigScreen;
