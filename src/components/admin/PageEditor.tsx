// Add this useEffect to the PageEditor component
useEffect(() => {
  if (!initialData?.id && !form.getValues('slug')) {
    const generatedSlug = form.getValues('title')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    form.setValue('slug', generatedSlug);
  }
}, [form, form.watch('title'), initialData]);