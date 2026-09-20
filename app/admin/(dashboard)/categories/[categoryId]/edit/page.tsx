interface EditCategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { categoryId } = await params;

  return (
    <main>
      <h1>Edit Category</h1>
      <p>Category ID: {categoryId}</p>
    </main>
  );
}
