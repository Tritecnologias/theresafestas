-- Add whatsapp_number column to store_settings if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'store_settings' 
        AND column_name = 'whatsapp_number'
    ) THEN
        ALTER TABLE public.store_settings 
        ADD COLUMN whatsapp_number text;
    END IF;
END $$;
