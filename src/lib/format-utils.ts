/**
 * Utilities for converting structured data to formatted text and PDF
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Convert Message Multiplier data to formatted text
 * Supports both new milestone/sub_topics structure and legacy header/topics structure
 */
export function formatMessageMultiplierText(data: Record<string, unknown>): string {
  // Try new structure first
  const milestone = data.milestone as { title?: string; theme?: string; order?: number } | undefined;
  const subTopics = (data.sub_topics as any[]) || [];
  const persona = data.persona as { name?: string; notes?: string } | undefined;
  
  // Check if using new structure
  if (milestone || subTopics.length > 0) {
    let text = '';

    // Header
    text += `${milestone?.title || 'THE MESSAGE MULTIPLIER™'}\n`;
    text += '='.repeat(80) + '\n\n';
    if (milestone?.theme) {
      text += `${milestone.theme}\n\n`;
    }
    if (persona?.name) {
      text += `Persona: ${persona.name}\n\n`;
    }
    if (persona?.notes) {
      text += `${persona.notes}\n\n`;
    }

    // Sub Topics
    subTopics.forEach((subTopic, topicIdx) => {
      text += `\n${'─'.repeat(80)}\n`;
      text += `TOPIC ${topicIdx + 1}: ${subTopic.title}\n`;
      text += `${'─'.repeat(80)}\n\n`;

      if (subTopic.pain_point) {
        text += `PAIN POINT:\n${subTopic.pain_point}\n\n`;
      }
      
      if (subTopic.fear_alleviated) {
        text += `FEAR ALLEVIATED:\n${subTopic.fear_alleviated}\n\n`;
      }
      
      if (subTopic.desired_outcome) {
        text += `DESIRED OUTCOME:\n${subTopic.desired_outcome}\n\n`;
      }
      
      if (subTopic.old_promise_exposed) {
        text += `OLD PROMISE EXPOSED:\n${subTopic.old_promise_exposed}\n\n`;
      }
      
      if (subTopic.belief_shift_required) {
        text += `BELIEF SHIFT REQUIRED:\n${subTopic.belief_shift_required}\n\n`;
      }
      
      if (subTopic.profound_desire_fulfilled) {
        text += `PROFOUND DESIRE FULFILLED:\n${subTopic.profound_desire_fulfilled}\n\n`;
      }

      // Sub-Sub Topics
      if (subTopic.sub_sub_topics && Array.isArray(subTopic.sub_sub_topics)) {
        text += `\nKEY FOCUS AREAS:\n\n`;
        subTopic.sub_sub_topics.forEach((subSubTopic: any) => {
          text += `  ${subSubTopic.order}. ${subSubTopic.title}\n`;
          text += `  ${'-'.repeat(70)}\n`;
          text += `  ${subSubTopic.description}\n\n`;
        });
      }
    });

    return text;
  }

  // Fall back to legacy structure
  const header = data.header as { title?: string; subtitle?: string; tagline?: string } | undefined;
  const topics = (data.topics as any[]) || [];

  let text = '';

  // Header
  if (header) {
    text += `${header.title || 'THE MESSAGE MULTIPLIER™'}\n`;
    text += '='.repeat(80) + '\n\n';
    if (header.subtitle) {
      text += `${header.subtitle}\n\n`;
    }
    if (header.tagline) {
      text += `${header.tagline}\n\n`;
    }
  }

  // Topics
  topics.forEach((topic, topicIdx) => {
    text += `\n${'─'.repeat(80)}\n`;
    text += `TOPIC ${topicIdx + 1}: ${topic.main_topic}\n`;
    text += `${'─'.repeat(80)}\n\n`;
    
    if (topic.summary) {
      text += `${topic.summary}\n\n`;
    }

    // Subtopics
    if (topic.subtopics && Array.isArray(topic.subtopics)) {
      topic.subtopics.forEach((subtopic: any, subIdx: number) => {
        text += `\n  ${subIdx + 1}. ${subtopic.title}\n`;
        text += `  ${'-'.repeat(70)}\n`;

        // Audience Link
        if (subtopic.audience_link) {
          text += `\n  AUDIENCE LINK:\n`;
          const links = Array.isArray(subtopic.audience_link) 
            ? subtopic.audience_link 
            : [subtopic.audience_link];
          links.forEach((link: string) => {
            text += `    • ${link}\n`;
          });
        }

        // Why It Resonates
        if (subtopic.why_it_resonates) {
          text += `\n  WHY IT RESONATES:\n`;
          text += `    ${subtopic.why_it_resonates}\n`;
        }

        // Formats
        if (subtopic.formats) {
          text += `\n  CONTENT FORMATS:\n`;
          const formats = Array.isArray(subtopic.formats) 
            ? subtopic.formats 
            : [subtopic.formats];
          formats.forEach((format: string) => {
            text += `    • ${format}\n`;
          });
        }

        text += '\n';
      });
    }
  });

  return text;
}

/**
 * Convert Event Funnel data to formatted text
 */
export function formatEventFunnelText(data: Record<string, unknown>): string {
  const header = data.header as { title?: string; subtitle?: string; tagline?: string } | undefined;
  const steps = (data.steps as any[]) || [];
  const bonus = data.bonus as any;

  let text = '';

  // Header
  if (header) {
    text += `${header.title || 'HIGH CONVERTING EVENT FUNNEL'}\n`;
    text += '='.repeat(80) + '\n\n';
    if (header.subtitle) {
      text += `${header.subtitle}\n\n`;
    }
    if (header.tagline) {
      text += `${header.tagline}\n\n`;
    }
  }

  // Steps
  steps.forEach((step, idx) => {
    text += `\n${'─'.repeat(80)}\n`;
    text += `STEP ${idx + 1}: ${step.heading}\n`;
    text += `${'─'.repeat(80)}\n\n`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, heading, ...content } = step;

    // Hero Section
    if (id === 'hero') {
      if (content.headline) {
        text += `HEADLINE:\n${content.headline}\n\n`;
      }
      if (content.subheadline) {
        text += `SUBHEADLINE:\n${content.subheadline}\n\n`;
      }

      // 5 W's
      text += `THE 5 W'S:\n`;
      if (content.what) text += `  • WHAT: ${content.what}\n`;
      if (content.who) text += `  • WHO: ${content.who}\n`;
      if (content.when) text += `  • WHEN: ${content.when}\n`;
      if (content.where) text += `  • WHERE: ${content.where}\n`;
      if (content.why) text += `  • WHY: ${content.why}\n`;
      text += '\n';

      // CTAs
      if (content.ctas && Array.isArray(content.ctas)) {
        text += `CALL TO ACTIONS:\n`;
        content.ctas.forEach((cta: string) => {
          text += `  • ${cta}\n`;
        });
        text += '\n';
      }

      // Visual
      if (content.visual) {
        text += `VISUAL SUGGESTION:\n${content.visual}\n\n`;
      }
    }
    // Ticketing Section
    else if (id === 'tickets' && content.tiers) {
      content.tiers.forEach((tier: any) => {
        text += `\n  ${tier.name}${tier.badge ? ` [${tier.badge}]` : ''}\n`;
        text += `  ${'-'.repeat(70)}\n`;
        text += `  Price: ${tier.price}`;
        if (tier.original_price) {
          text += ` (was ${tier.original_price})`;
        }
        text += '\n\n  Benefits:\n';
        tier.benefits.forEach((benefit: string) => {
          text += `    ✓ ${benefit}\n`;
        });
        text += '\n';
      });

      if (content.scarcity) {
        text += `\nSCARCITY ELEMENTS:\n`;
        content.scarcity.forEach((item: string) => {
          text += `  • ${item}\n`;
        });
        text += '\n';
      }

      if (content.payment_plans) {
        text += `\nPAYMENT OPTIONS:\n`;
        content.payment_plans.forEach((plan: string) => {
          text += `  • ${plan}\n`;
        });
        text += '\n';
      }
    }
    // Generic content
    else {
      Object.entries(content).forEach(([key, value]) => {
        if (key === 'id' || key === 'heading') return;

        const label = key.replace(/_/g, ' ').toUpperCase();
        text += `${label}:\n`;

        if (Array.isArray(value)) {
          value.forEach((item: any) => {
            if (typeof item === 'object') {
              Object.entries(item).forEach(([k, v]) => {
                text += `  • ${k}: ${v}\n`;
              });
            } else {
              text += `  • ${item}\n`;
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([k, v]) => {
            text += `  ${k}: ${v}\n`;
          });
        } else {
          text += `  ${value}\n`;
        }
        text += '\n';
      });
    }
  });

  // Bonus
  if (bonus) {
    text += `\n${'='.repeat(80)}\n`;
    text += `BONUS: ADVANCED OPTIMIZATION\n`;
    text += `${'='.repeat(80)}\n\n`;

    Object.entries(bonus).forEach(([key, value]) => {
      const label = key.replace(/_/g, ' ').toUpperCase();
      text += `${label}:\n`;

      if (Array.isArray(value)) {
        value.forEach((item: any) => {
          text += `  • ${typeof item === 'object' ? JSON.stringify(item) : item}\n`;
        });
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([k, v]) => {
          text += `  ${k}: ${v}\n`;
        });
      } else {
        text += `  ${value}\n`;
      }
      text += '\n';
    });
  }

  return text;
}

/**
 * Convert ICP data to formatted text
 */
export function formatICPText(data: Record<string, unknown>): string {
  let text = '';

  const header = data.header as { title?: string; subtitle?: string; tagline?: string } | undefined;
  if (header) {
    text += `${header.title || 'IDEAL CUSTOMER PROFILE'}\n`;
    text += '='.repeat(80) + '\n\n';
    if (header.subtitle) text += `${header.subtitle}\n\n`;
    if (header.tagline) text += `${header.tagline}\n\n`;
  }

  // Process each section
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'header') return;

    const sectionTitle = key.replace(/_/g, ' ').toUpperCase();
    text += `\n${'─'.repeat(80)}\n`;
    text += `${sectionTitle}\n`;
    text += `${'─'.repeat(80)}\n\n`;

    if (Array.isArray(value)) {
      value.forEach((item: any, idx: number) => {
        if (typeof item === 'object') {
          Object.entries(item).forEach(([k, v]) => {
            const label = k.replace(/_/g, ' ');
            text += `  ${label}: ${v}\n`;
          });
          text += '\n';
        } else {
          text += `  ${idx + 1}. ${item}\n`;
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([k, v]) => {
        const label = k.replace(/_/g, ' ');
        if (Array.isArray(v)) {
          text += `  ${label}:\n`;
          v.forEach((item: any) => {
            text += `    • ${item}\n`;
          });
        } else {
          text += `  ${label}: ${v}\n`;
        }
      });
    } else {
      text += `  ${value}\n`;
    }
    text += '\n';
  });

  return text;
}

/**
 * Convert Content Compass data to formatted text
 */
export function formatContentCompassText(data: Record<string, unknown>): string {
  let text = '';

  const header = data.header as { title?: string; subtitle?: string; tagline?: string } | undefined;
  if (header) {
    text += `${header.title || 'CONTENT COMPASS'}\n`;
    text += '='.repeat(80) + '\n\n';
    if (header.subtitle) text += `${header.subtitle}\n\n`;
    if (header.tagline) text += `${header.tagline}\n\n`;
  }

  // Check for ClientValueMap format (new structure)
  const valueMap = data.map as any;
  if (valueMap && (valueMap.current_state || valueMap.desired_state || valueMap.key_milestones)) {
    // Format Current State
    if (valueMap.current_state) {
      text += `\n${'═'.repeat(80)}\n`;
      text += `${valueMap.current_state.heading || 'CURRENT STATE (POINT A)'}\n`;
      text += `${'═'.repeat(80)}\n\n`;
      text += `${valueMap.current_state.description}\n\n`;
    }

    // Format Desired State
    if (valueMap.desired_state) {
      text += `\n${'═'.repeat(80)}\n`;
      text += `${valueMap.desired_state.heading || 'DESIRED STATE (POINT B)'}\n`;
      text += `${'═'.repeat(80)}\n\n`;
      text += `${valueMap.desired_state.description}\n\n`;
    }

    // Format Key Milestones
    if (valueMap.key_milestones && Array.isArray(valueMap.key_milestones)) {
      text += `\n${'═'.repeat(80)}\n`;
      text += `KEY MILESTONES\n`;
      text += `${'═'.repeat(80)}\n\n`;

      valueMap.key_milestones.forEach((milestone: any, idx: number) => {
        text += `\n${'─'.repeat(80)}\n`;
        text += `MILESTONE ${idx + 1}: ${milestone.title}\n`;
        text += `${'─'.repeat(80)}\n\n`;

        if (milestone.importance) {
          text += `WHY THIS MATTERS:\n${milestone.importance}\n\n`;
        }

        if (milestone.sub_topics && Array.isArray(milestone.sub_topics)) {
          text += `KEY FOCUS AREAS:\n`;
          milestone.sub_topics.forEach((topic: string) => {
            text += `  • ${topic}\n`;
          });
          text += '\n';
        }

        if (milestone.content_types && Array.isArray(milestone.content_types)) {
          text += `RECOMMENDED CONTENT:\n`;
          milestone.content_types.forEach((content: string) => {
            text += `  • ${content}\n`;
          });
          text += '\n';
        }
      });
    }

    // Format Transformation Summary
    if (valueMap.transformation_summary) {
      text += `\n${'═'.repeat(80)}\n`;
      text += `${valueMap.transformation_summary.heading || 'TRANSFORMATION SUMMARY'}\n`;
      text += `${'═'.repeat(80)}\n\n`;
      text += `${valueMap.transformation_summary.description}\n\n`;
    }

    // Format Content Strategy Overview
    if (valueMap.content_strategy_overview && valueMap.content_strategy_overview.description) {
      text += `\n${'═'.repeat(80)}\n`;
      text += `${valueMap.content_strategy_overview.heading || 'CONTENT STRATEGY OVERVIEW'}\n`;
      text += `${'═'.repeat(80)}\n\n`;
      text += `${valueMap.content_strategy_overview.description}\n\n`;
    }

    return text;
  }

  // Fallback to legacy profiles format
  const profiles = (data.profiles as any[]) || [];

  profiles.forEach((profile: any, profileIdx: number) => {
    text += `\n${'═'.repeat(80)}\n`;
    text += `PROFILE ${profileIdx + 1}: ${profile.icp || 'ICP Profile'}\n`;
    text += `${'═'.repeat(80)}\n\n`;

    // Process sections within each profile
    const sections = profile.sections || [];

    sections.forEach((section: any) => {
      text += `\n${'─'.repeat(80)}\n`;
      text += `${section.heading}\n`;
      text += `${'─'.repeat(80)}\n\n`;

      // Process all properties except id and heading
      Object.entries(section).forEach(([key, value]) => {
        if (key === 'id' || key === 'heading') return;

        const label = key.replace(/_/g, ' ').toUpperCase();
        text += `${label}:\n`;

        if (Array.isArray(value)) {
          value.forEach((item: any) => {
            if (typeof item === 'object' && item !== null) {
              Object.entries(item).forEach(([k, v]) => {
                text += `  • ${k.replace(/_/g, ' ')}: ${v}\n`;
              });
            } else {
              text += `  • ${item}\n`;
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([k, v]) => {
            const subLabel = k.replace(/_/g, ' ');
            text += `  ${subLabel}:\n`;
            if (Array.isArray(v)) {
              v.forEach((subItem: any) => {
                text += `    • ${subItem}\n`;
              });
            } else {
              text += `    ${v}\n`;
            }
          });
        } else {
          text += `  ${value}\n`;
        }
        text += '\n';
      });
    });
  });

  return text;
}

/**
 * Convert Landing Page data to formatted text
 */
export function formatLandingPageText(data: Record<string, unknown>): string {
  let text = '';

  const header = data.header as { title?: string; subtitle?: string; tagline?: string } | undefined;
  if (header) {
    text += `${header.title || 'LANDING PAGE BLUEPRINT'}\n`;
    text += '='.repeat(80) + '\n\n';
    if (header.subtitle) text += `${header.subtitle}\n\n`;
    if (header.tagline) text += `${header.tagline}\n\n`;
  }

  const sections = (data.sections as any[]) || [];

  sections.forEach((section: any, idx: number) => {
    const id = section.id as string | undefined;
    const heading = section.heading || (id ? id.replace(/_/g, ' ').toUpperCase() : `Section ${idx + 1}`);

    text += `\n${'─'.repeat(80)}\n`;
    text += `${heading}\n`;
    text += `${'─'.repeat(80)}\n\n`;

    // Step 1 - Hero
    if (id === 'hero') {
      if (section.headline) {
        text += `HEADLINE:\n${section.headline}\n\n`;
      }
      if (section.subheadline) {
        text += `SUBHEADLINE:\n${section.subheadline}\n\n`;
      }
      text += `THE 5 W'S:\n`;
      if (section.what) text += `  • WHAT: ${section.what}\n`;
      if (section.who) text += `  • WHO: ${section.who}\n`;
      if (section.when) text += `  • WHEN: ${section.when}\n`;
      if (section.where) text += `  • WHERE: ${section.where}\n`;
      if (section.why) text += `  • WHY: ${section.why}\n`;
      text += '\n';
      if (Array.isArray(section.ctas)) {
        text += `CALLS TO ACTION:\n`;
        section.ctas.forEach((cta: string) => (text += `  • ${cta}\n`));
        text += '\n';
      }
      if (section.visual) {
        text += `VISUAL:\n${section.visual}\n\n`;
      }
      if (section.social_proof_tag) {
        text += `SOCIAL PROOF TAG:\n${section.social_proof_tag}\n\n`;
      }
      return;
    }

    // Step 2 - Overview
    if (id === 'overview') {
      if (Array.isArray(section.paragraphs)) {
        section.paragraphs.forEach((p: string, i: number) => {
          text += `PARAGRAPH ${i + 1}:\n${p}\n\n`;
        });
      }
      if (Array.isArray(section.pillars)) {
        text += `KEY PILLARS:\n`;
        section.pillars.forEach((pillar: string) => (text += `  • ${pillar}\n`));
        text += '\n';
      }
      if (section.cta) {
        text += `CTA:\n${section.cta}\n\n`;
      }
      return;
    }

    // Step 3 - Audience
    if (id === 'audience') {
      if (Array.isArray(section.segments)) {
        text += `SEGMENTS:\n`;
        section.segments.forEach((s: string) => (text += `  • ${s}\n`));
        text += '\n';
      }
      if (Array.isArray(section.not_for)) {
        text += `NOT FOR:\n`;
        section.not_for.forEach((n: string) => (text += `  • ${n}\n`));
        text += '\n';
      }
      if (section.fomo_copy) {
        text += `FIT NOTE:\n${section.fomo_copy}\n\n`;
      }
      return;
    }

    // Step 4 - Speakers & Sponsors
    if (id === 'speakers') {
      if (Array.isArray(section.speakers)) {
        section.speakers.forEach((sp: any, i: number) => {
          text += `SPEAKER ${i + 1}:\n`;
          if (sp.name) text += `  Name: ${sp.name}\n`;
          if (sp.value_bio) text += `  Bio: ${sp.value_bio}\n`;
          if (sp.session_focus) text += `  Focus: ${sp.session_focus}\n`;
          text += '\n';
        });
      }
      if (Array.isArray(section.sponsors) && section.sponsors.length > 0) {
        text += `SPONSORS:\n`;
        section.sponsors.forEach((s: string) => (text += `  • ${s}\n`));
        text += '\n';
      }
      if (section.cta) {
        text += `CTA:\n${section.cta}\n\n`;
      }
      return;
    }

    // Step 5 - Schedule Overview
    if (id === 'schedule') {
      if (Array.isArray(section.arc)) {
        section.arc.forEach((phase: any) => {
          text += `PHASE: ${phase.phase}${phase.vip_only ? ' (VIP Only)' : ''}\n`;
          text += `THEME: ${phase.theme}\n\n`;
          if (Array.isArray(phase.outcomes)) {
            text += `OUTCOMES:\n`;
            phase.outcomes.forEach((o: string) => (text += `  • ${o}\n`));
            text += '\n';
          }
          if (phase.emotional_benefit) {
            text += `EMOTIONAL BENEFIT:\n${phase.emotional_benefit}\n\n`;
          }
        });
      }
      if (section.cta) {
        text += `CTA:\n${section.cta}\n\n`;
      }
      return;
    }

    // Step 6 - Venue or Platform
    if (id === 'venue_or_platform') {
      if (section.description) {
        text += `DESCRIPTION:\n${section.description}\n\n`;
      }
      if (Array.isArray(section.benefits)) {
        text += `BENEFITS:\n`;
        section.benefits.forEach((b: string) => (text += `  • ${b}\n`));
        text += '\n';
      }
      if (Array.isArray(section.logistics)) {
        text += `LOGISTICS:\n`;
        section.logistics.forEach((l: string) => (text += `  • ${l}\n`));
        text += '\n';
      }
      if (section.cta) {
        text += `CTA:\n${section.cta}\n\n`;
      }
      return;
    }

    // Step 7 - Ticketing
    if (id === 'ticketing') {
      if (Array.isArray(section.tiers)) {
        section.tiers.forEach((tier: any) => {
          text += `${tier.name}${tier.badge ? ` [${tier.badge}]` : ''}\n`;
          text += `Price: ${tier.price}`;
          if (tier.original_price) text += ` (was ${tier.original_price})`;
          text += '\n\nBENEFITS:\n';
          (tier.benefits || []).forEach((b: string) => (text += `  ✓ ${b}\n`));
          text += '\n';
        });
      }
      if (Array.isArray(section.urgency)) {
        text += `URGENCY:\n`;
        section.urgency.forEach((u: string) => (text += `  • ${u}\n`));
        text += '\n';
      }
      if (Array.isArray(section.payment_plans)) {
        text += `PAYMENT PLANS:\n`;
        section.payment_plans.forEach((p: string) => (text += `  • ${p}\n`));
        text += '\n';
      }
      if (section.guarantee) {
        text += `GUARANTEE:\n${section.guarantee}\n\n`;
      }
      return;
    }

    // Step 8 - Testimonials & Reviews
    if (id === 'testimonials') {
      if (Array.isArray(section.items)) {
        section.items.forEach((t: any, i: number) => {
          text += `TESTIMONIAL ${i + 1}:\n`;
          if (t.pull_quote) text += `  Quote: "${t.pull_quote}"\n`;
          if (t.before) text += `  Before: ${t.before}\n`;
          if (t.experience) text += `  Experience: ${t.experience}\n`;
          if (t.after) text += `  After: ${t.after}\n`;
          if (t.author) text += `  Author: ${t.author}\n`;
          text += '\n';
        });
      }
      if (section.video_strategy) {
        text += `VIDEO STRATEGY:\n${section.video_strategy}\n\n`;
      }
      if (Array.isArray(section.trust_signals)) {
        text += `TRUST SIGNALS:\n`;
        section.trust_signals.forEach((s: string) => (text += `  • ${s}\n`));
        text += '\n';
      }
      if (section.cta) {
        text += `CTA:\n${section.cta}\n\n`;
      }
      return;
    }

    // Step 9 - FAQ
    if (id === 'faq') {
      if (Array.isArray(section.items)) {
        section.items.forEach((qa: any, i: number) => {
          text += `Q${i + 1}: ${qa.q}\nA${i + 1}: ${qa.a}\n\n`;
        });
      }
      if (section.reassurance) {
        text += `REASSURANCE:\n${section.reassurance}\n\n`;
      }
      if (section.cta) {
        text += `CTA:\n${section.cta}\n\n`;
      }
      return;
    }

    // Step 10 - Info Capture
    if (id === 'lead_capture') {
      if (section.form) {
        text += `FORM:\n`;
        if (section.form.headline) text += `  Headline: ${section.form.headline}\n`;
        if (Array.isArray(section.form.fields)) {
          text += `  Fields:\n`;
          section.form.fields.forEach((f: string) => (text += `    • ${f}\n`));
        }
        if (section.form.privacy) text += `  Privacy: ${section.form.privacy}\n`;
        if (section.form.cta) text += `  CTA: ${section.form.cta}\n`;
        text += '\n';
      }
      if (section.post_opt_in) {
        text += `POST-OPT-IN:\n`;
        if (section.post_opt_in.redirect) text += `  Redirect: ${section.post_opt_in.redirect}\n`;
        if (Array.isArray(section.post_opt_in.emails)) {
          text += `  Emails:\n`;
          section.post_opt_in.emails.forEach((e: string) => (text += `    • ${e}\n`));
        }
        if (Array.isArray(section.post_opt_in.sms)) {
          text += `  SMS:\n`;
          section.post_opt_in.sms.forEach((s: string) => (text += `    • ${s}\n`));
        }
        if (section.post_opt_in.lead_magnet) text += `  Lead Magnet: ${section.post_opt_in.lead_magnet}\n`;
        text += '\n';
      }
      return;
    }

    // Step 11 - Final CTA & Optimisation
    if (id === 'final_cta') {
      if (Array.isArray(section.placement_map)) {
        text += `PLACEMENT MAP:\n`;
        section.placement_map.forEach((p: string) => (text += `  • ${p}\n`));
        text += '\n';
      }
      if (Array.isArray(section.cta_variants)) {
        text += `CTA VARIANTS:\n`;
        section.cta_variants.forEach((c: string) => (text += `  • ${c}\n`));
        text += '\n';
      }
      if (section.consistency_rule) {
        text += `CONSISTENCY RULE:\n${section.consistency_rule}\n\n`;
      }
      if (Array.isArray(section.urgency_elements)) {
        text += `URGENCY ELEMENTS:\n`;
        section.urgency_elements.forEach((u: string) => (text += `  • ${u}\n`));
        text += '\n';
      }
      if (section.exit_intent) {
        text += `EXIT INTENT:\n`;
        if (section.exit_intent.headline) text += `  Headline: ${section.exit_intent.headline}\n`;
        if (section.exit_intent.offer) text += `  Offer: ${section.exit_intent.offer}\n`;
        if (section.exit_intent.cta) text += `  CTA: ${section.exit_intent.cta}\n`;
        text += '\n';
      }
      if (Array.isArray(section.mobile_notes)) {
        text += `MOBILE NOTES:\n`;
        section.mobile_notes.forEach((m: string) => (text += `  • ${m}\n`));
        text += '\n';
      }
      return;
    }

    // Fallback generic formatter for any unknown section
    Object.entries(section).forEach(([key, value]) => {
      if (key === 'id' || key === 'heading') return;
      const label = key.replace(/_/g, ' ').toUpperCase();
      text += `${label}:\n`;
      if (Array.isArray(value)) {
        (value as any[]).forEach((item: any) => {
          if (typeof item === 'object' && item !== null) {
            Object.entries(item).forEach(([k, v]) => (text += `  • ${k}: ${v}\n`));
          } else {
            text += `  • ${item}\n`;
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value as Record<string, unknown>).forEach(([k, v]) => (text += `  ${k}: ${v}\n`));
      } else {
        text += `  ${String(value)}\n`;
      }
      text += '\n';
    });
  });

  return text;
}
/**
 * Convert Audience Architect data to formatted text
 */
export function formatAudienceArchitectText(data: Record<string, unknown>): string {
  let text = '';

  const header = data.header as { title?: string; subtitle?: string; tagline?: string } | undefined;
  if (header) {
    text += `${header.title || 'AUDIENCE ARCHITECT'}\n`;
    text += '='.repeat(80) + '\n\n';
    if (header.subtitle) text += `${header.subtitle}\n\n`;
    if (header.tagline) text += `${header.tagline}\n\n`;
  }

  // Add context if available
  const context = data.context as { target_market?: string; product?: string } | undefined;
  if (context) {
    if (context.target_market || context.product) {
      text += `${'─'.repeat(80)}\n`;
      text += 'CONTEXT\n';
      text += `${'─'.repeat(80)}\n\n`;
      if (context.target_market) text += `Target Market: ${context.target_market}\n`;
      if (context.product) text += `Product: ${context.product}\n`;
      text += '\n';
    }
  }

  // Process sections array
  const sections = (data.sections as any[]) || [];

  sections.forEach((section: any, idx: number) => {
    text += `\n${'─'.repeat(80)}\n`;
    text += `${section.heading || 'Section ' + (idx + 1)}\n`;
    text += `${'─'.repeat(80)}\n\n`;

    // Process all properties except id and heading
    Object.entries(section).forEach(([key, value]) => {
      if (key === 'id' || key === 'heading') return;

      const label = key.replace(/_/g, ' ').toUpperCase();
      
      // Handle different data types
      if (key === 'content' && typeof value === 'string') {
        text += `${value}\n\n`;
      } else if (key === 'fields' && typeof value === 'object' && value !== null) {
        // Demographics fields
        Object.entries(value).forEach(([fieldKey, fieldValue]) => {
          text += `${fieldKey.replace(/_/g, ' ')}: ${fieldValue}\n`;
        });
        text += '\n';
      } else if (Array.isArray(value)) {
        text += `${label}:\n`;
        value.forEach((item: any, itemIdx: number) => {
          if (typeof item === 'object' && item !== null) {
            text += `  ${itemIdx + 1}.\n`;
            Object.entries(item).forEach(([k, v]) => {
              const itemLabel = k.replace(/_/g, ' ');
              if (Array.isArray(v)) {
                text += `     ${itemLabel}:\n`;
                v.forEach((subItem: any) => {
                  text += `       • ${subItem}\n`;
                });
              } else {
                text += `     ${itemLabel}: ${v}\n`;
              }
            });
            text += '\n';
          } else {
            text += `  • ${item}\n`;
          }
        });
        text += '\n';
      } else if (typeof value === 'object' && value !== null) {
        text += `${label}:\n`;
        Object.entries(value).forEach(([k, v]) => {
          const subLabel = k.replace(/_/g, ' ');
          if (Array.isArray(v)) {
            text += `  ${subLabel}:\n`;
            v.forEach((item: any) => {
              text += `    • ${item}\n`;
            });
          } else {
            text += `  ${subLabel}: ${v}\n`;
          }
        });
        text += '\n';
      } else {
        text += `${label}:\n  ${value}\n\n`;
      }
    });
  });

  return text;
}

/**
 * Convert Offer Prompt data to formatted text
 */
export function formatOfferPromptText(data: Record<string, unknown>): string {
  let text = '';

  const title = data.title as string | undefined;
  const targetAudience = data.target_audience as string | undefined;
  const scarcity = data.scarcity as { spots_left?: number; line?: string } | undefined;
  const outcome = data.outcome as {
    month?: string;
    core_promise?: string;
    program_structure?: string;
    copy_block?: string;
  } | undefined;
  const programModel = data.program_model as {
    initial_phase?: {
      title?: string;
      quick_wins?: string;
      deliverables?: string[];
      duration?: string;
    };
    subsequent_phases?: Array<{
      title?: string;
      focus?: string;
      deliverables?: string[];
      duration?: string;
    }>;
    proprietary_tools?: string[];
    ongoing_support?: string;
  } | undefined;
  const investment = data.investment as {
    details?: string;
    price?: { amount?: number; currency?: string };
    setup_fee?: { amount?: number; currency?: string };
    payment_structure?: string;
    trial_or_free_period?: string;
  } | undefined;
  const idealCandidate = data.ideal_candidate as {
    preface?: string;
    criteria?: string[];
    humorous_criterion?: string;
  } | undefined;
  const gettingStarted = data.getting_started as { steps?: string[] } | undefined;
  const signOff = data.sign_off as string | undefined;
  const ps = data.ps as {
    quick_start_bonus?: string;
    description?: string;
    value?: { amount?: number; currency?: string };
  } | undefined;

  text += 'OFFER PROMPT\n';
  text += '='.repeat(80) + '\n\n';

  if (title) {
    text += `TITLE:\n${title}\n\n`;
  }

  if (targetAudience) {
    text += `TARGET AUDIENCE:\n${targetAudience}\n\n`;
  }

  if (scarcity?.line) {
    text += `SCARCITY:\n${scarcity.line}`;
    if (typeof scarcity.spots_left === 'number') {
      text += ` (${scarcity.spots_left} spots left)`;
    }
    text += '\n\n';
  }

  if (outcome) {
    text += `${'─'.repeat(80)}\n`;
    text += 'OUTCOME\n';
    text += `${'─'.repeat(80)}\n\n`;
    if (outcome.core_promise) text += `Core Promise: ${outcome.core_promise}\n`;
    if (outcome.program_structure) text += `Program Structure: ${outcome.program_structure}\n`;
    if (outcome.copy_block) text += `\n${outcome.copy_block}\n`;
    text += '\n';
  }

  if (programModel) {
    text += `${'─'.repeat(80)}\n`;
    text += 'PROGRAM MODEL\n';
    text += `${'─'.repeat(80)}\n\n`;
    
    if (programModel.initial_phase) {
      const ip = programModel.initial_phase;
      text += `Initial Phase: ${ip.title || 'Quick Wins'}\n`;
      if (ip.quick_wins) text += `Quick Wins: ${ip.quick_wins}\n`;
      if (ip.deliverables?.length) {
        text += 'Deliverables:\n';
        ip.deliverables.forEach((d) => (text += `  • ${d}\n`));
      }
      if (ip.duration) text += `Duration: ${ip.duration}\n`;
      text += '\n';
    }
    
    if (programModel.subsequent_phases?.length) {
      text += 'Subsequent Phases:\n';
      programModel.subsequent_phases.forEach((phase, idx) => {
        text += `\n  Phase ${idx + 1}: ${phase.title || ''}\n`;
        if (phase.focus) text += `  Focus: ${phase.focus}\n`;
        if (phase.deliverables?.length) {
          text += '  Deliverables:\n';
          phase.deliverables.forEach((d) => (text += `    • ${d}\n`));
        }
        if (phase.duration) text += `  Duration: ${phase.duration}\n`;
      });
      text += '\n';
    }
    
    if (programModel.proprietary_tools?.length) {
      text += 'Proprietary Tools:\n';
      programModel.proprietary_tools.forEach((t) => (text += `  • ${t}\n`));
      text += '\n';
    }
    
    if (programModel.ongoing_support) {
      text += `Ongoing Support: ${programModel.ongoing_support}\n\n`;
    }
  }

  if (investment) {
    text += `${'─'.repeat(80)}\n`;
    text += 'INVESTMENT\n';
    text += `${'─'.repeat(80)}\n\n`;
    if (investment.details) text += `${investment.details}\n`;
    if (investment.price?.amount) text += `Price: ${investment.price.amount} ${investment.price.currency || 'USD'}\n`;
    if (investment.setup_fee?.amount !== undefined) text += `Setup Fee: ${investment.setup_fee.amount} ${investment.setup_fee.currency || 'USD'}\n`;
    if (investment.payment_structure) text += `Payment Structure: ${investment.payment_structure}\n`;
    if (investment.trial_or_free_period) text += `${investment.trial_or_free_period}\n`;
    text += '\n';
  }

  if (idealCandidate) {
    text += `${'─'.repeat(80)}\n`;
    text += 'IDEAL CANDIDATE\n';
    text += `${'─'.repeat(80)}\n\n`;
    if (idealCandidate.preface) text += `${idealCandidate.preface}\n\n`;
    if (idealCandidate.criteria?.length) {
      idealCandidate.criteria.forEach((c) => (text += `  • ${c}\n`));
      text += '\n';
    }
    if (idealCandidate.humorous_criterion) text += `${idealCandidate.humorous_criterion}\n\n`;
  }

  if (gettingStarted?.steps?.length) {
    text += `${'─'.repeat(80)}\n`;
    text += 'GETTING STARTED\n';
    text += `${'─'.repeat(80)}\n\n`;
    gettingStarted.steps.forEach((s, idx) => (text += `${idx + 1}. ${s}\n`));
    text += '\n';
  }

  if (signOff) {
    text += `${'─'.repeat(80)}\n`;
    text += 'SIGN-OFF\n';
    text += `${'─'.repeat(80)}\n\n`;
    text += `${signOff}\n\n`;
  }

  if (ps) {
    text += `${'─'.repeat(80)}\n`;
    text += 'P.S.\n';
    text += `${'─'.repeat(80)}\n\n`;
    if (ps.quick_start_bonus) text += `Quick-Start Bonus: ${ps.quick_start_bonus}\n`;
    if (ps.description) text += `${ps.description}\n`;
    if (ps.value?.amount) text += `Bonus Value: ${ps.value.amount} ${ps.value.currency || 'USD'}\n`;
    text += '\n';
  }

  return text;
}
