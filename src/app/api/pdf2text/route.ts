// app/api/pdf2text/route.ts
export async function POST(req: Request) {
    const { file_content, filename } = await req.json();
    const res = await fetch(`${process.env.AWS_LAMBDA_PDF2TEXT}/default/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_content, filename }),
    });

    const data = await res.json();
    return Response.json(data);
}
