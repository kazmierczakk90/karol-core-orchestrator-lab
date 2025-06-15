
INSERT INTO public.kpi_data (name, value, threshold, trend)
VALUES ('system_level', 10, 10, 'MAX')
ON CONFLICT (name) DO UPDATE 
SET value = EXCLUDED.value,
    threshold = EXCLUDED.threshold,
    trend = EXCLUDED.trend,
    last_update = NOW();
