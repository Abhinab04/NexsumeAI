import express, {
    type Router,
    type Request,
    type Response,
} from "express";

import ejs from "ejs";
import path from "path";
import fs from "fs";
import os from "os";
import crypto from "node:crypto";
import { create as createTar } from "tar";

export const pdfGeneratorRouter: Router =
    express.Router();


// =====================================================
// Escape LaTeX
// =====================================================

const escapeLatex = (str: string): string => {
    if (typeof str !== "string") {
        return str;
    }

    return str
        .replace(/\\/g, "\\textbackslash ")
        .replace(/&/g, "\\&")
        .replace(/%/g, "\\%")
        .replace(/\$/g, "\\$")
        .replace(/#/g, "\\#")
        .replace(/_/g, "\\_")
        .replace(/\{/g, "\\{")
        .replace(/\}/g, "\\}")
        .replace(/~/g, "\\textasciitilde ")
        .replace(/\^/g, "\\textasciicircum ");
};


// =====================================================
// Recursively escape LaTeX
// =====================================================

const recursivelyEscapeLatex = (
    obj: any
): any => {

    if (Array.isArray(obj)) {
        return obj.map(
            recursivelyEscapeLatex
        );
    }

    if (
        obj !== null &&
        typeof obj === "object"
    ) {

        const newObj: any = {};

        for (
            const [key, value]
            of Object.entries(obj)
        ) {
            newObj[key] =
                recursivelyEscapeLatex(value);
        }

        return newObj;
    }

    if (typeof obj === "string") {
        return escapeLatex(obj);
    }

    return obj;
};


// =====================================================
// Generate PDF
// =====================================================

pdfGeneratorRouter.post(
    "/generate-pdf",

    async (
        req: Request,
        res: Response
    ) => {

        let tempDir = "";

        try {

            console.log(
                "\n========== PDF GENERATION =========="
            );


            // -----------------------------------------
            // Request data
            // -----------------------------------------

            const {
                structuredResume,
                templateId,
            } = req.body;


            if (!structuredResume) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Missing structuredResume data",
                });

            }


            // -----------------------------------------
            // Select template
            // -----------------------------------------

            let templateName =
                "jakes_resume.ejs";

            switch (templateId) {

                case "minimal":
                    templateName =
                        "minimal.ejs";
                    break;

                case "template2":
                    templateName =
                        "template2.ejs";
                    break;

                case "template3":
                    templateName =
                        "template3.ejs";
                    break;

                case "template4":
                    templateName =
                        "template4.ejs";
                    break;

                case "anubhav":
                    templateName =
                        "template5.ejs";
                    break;

                case "jakes_resume":
                default:
                    templateName =
                        "jakes_resume.ejs";
                    break;
            }


            console.log(
                "Template:",
                templateName
            );


            // -----------------------------------------
            // Template path
            // -----------------------------------------

            const templatePath =
                path.join(
                    __dirname,
                    "../templates",
                    templateName
                );


            console.log(
                "Template path:",
                templatePath
            );


            if (!fs.existsSync(
                templatePath
            )) {

                throw new Error(
                    `Template not found: ${templatePath}`
                );

            }


            // -----------------------------------------
            // Prepare data
            // -----------------------------------------

            const safeResume =
                recursivelyEscapeLatex(
                    structuredResume
                );


            // -----------------------------------------
            // EJS → LaTeX
            // -----------------------------------------

            console.log(
                "Rendering EJS..."
            );

            const latexString =
                await ejs.renderFile(
                    templatePath,
                    safeResume
                );


            if (
                !latexString ||
                latexString.trim().length === 0
            ) {

                throw new Error(
                    "Generated LaTeX is empty"
                );

            }


            console.log(
                "LaTeX generated successfully"
            );

            console.log(
                "LaTeX length:",
                latexString.length
            );


            // -----------------------------------------
            // Temporary directory
            // -----------------------------------------

            tempDir = path.join(
                os.tmpdir(),
                `nexsume-${crypto.randomUUID()}`
            );


            fs.mkdirSync(
                tempDir,
                {
                    recursive: true,
                }
            );


            // -----------------------------------------
            // Create TEX file
            // -----------------------------------------

            const texFileName =
                "resume.tex";

            const texPath =
                path.join(
                    tempDir,
                    texFileName
                );


            fs.writeFileSync(
                texPath,
                latexString,
                "utf8"
            );


            console.log(
                "TEX file created:",
                texPath
            );


            // -----------------------------------------
            // CREATE VALID TAR ARCHIVE
            // -----------------------------------------

            const tarPath =
                path.join(
                    tempDir,
                    "resume.tar"
                );


            console.log(
                "Creating TAR archive..."
            );


            await createTar(
                {
                    cwd: tempDir,
                    file: tarPath,
                },
                [
                    texFileName,
                ]
            );


            console.log(
                "TAR created:",
                tarPath
            );


            // -----------------------------------------
            // Verify TAR exists
            // -----------------------------------------

            if (!fs.existsSync(
                tarPath
            )) {

                throw new Error(
                    "TAR archive was not created"
                );

            }


            const tarBuffer =
                fs.readFileSync(
                    tarPath
                );


            console.log(
                "TAR size:",
                tarBuffer.length,
                "bytes"
            );


            if (
                tarBuffer.length === 0
            ) {

                throw new Error(
                    "TAR archive is empty"
                );

            }


            // -----------------------------------------
            // Native FormData
            // -----------------------------------------

            const formData =
                new FormData();


            const tarBlob =
                new Blob(
                    [
                        tarBuffer,
                    ],
                    {
                        type:
                            "application/x-tar",
                    }
                );


            formData.append(
                "file",
                tarBlob,
                "resume.tar"
            );


            // -----------------------------------------
            // LaTeX.Online /data
            // -----------------------------------------

            const compilerUrl =
                "https://latexonline.cc/data" +
                "?target=resume.tex" +
                "&command=pdflatex" +
                "&force=true";


            console.log(
                "Sending TAR to LaTeX.Online..."
            );

            console.log(
                "Target: resume.tex"
            );


            const compilerResponse =
                await fetch(
                    compilerUrl,
                    {
                        method: "POST",

                        body: formData,
                    }
                );


            console.log(
                "Compiler status:",
                compilerResponse.status
            );

            console.log(
                "Compiler content type:",
                compilerResponse.headers.get(
                    "content-type"
                )
            );


            // -----------------------------------------
            // Compiler error
            // -----------------------------------------

            if (
                !compilerResponse.ok
            ) {

                const errorText =
                    await compilerResponse.text();


                console.error(
                    "\n========== LATEX COMPILER ERROR =========="
                );

                console.error(
                    "Status:",
                    compilerResponse.status
                );

                console.error(
                    "Error:",
                    errorText
                );

                console.error(
                    "=========================================="
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to compile LaTeX to PDF",

                    details:
                        errorText,

                });

            }


            // -----------------------------------------
            // Read response
            // -----------------------------------------

            const arrayBuffer =
                await compilerResponse.arrayBuffer();


            const pdfBuffer =
                Buffer.from(
                    arrayBuffer
                );


            console.log(
                "Received:",
                pdfBuffer.length,
                "bytes"
            );


            // -----------------------------------------
            // Verify PDF magic bytes
            // -----------------------------------------

            const header =
                pdfBuffer
                    .subarray(0, 5)
                    .toString("ascii");


            console.log(
                "File header:",
                header
            );


            if (
                header !== "%PDF-"
            ) {

                const responseText =
                    pdfBuffer.toString(
                        "utf8"
                    );


                console.error(
                    "Expected PDF but received:"
                );

                console.error(
                    responseText.substring(
                        0,
                        1000
                    )
                );


                throw new Error(
                    "LaTeX.Online returned a non-PDF response"
                );

            }


            // -----------------------------------------
            // SUCCESS
            // -----------------------------------------

            console.log(
                "PDF generated successfully!"
            );

            console.log(
                "PDF size:",
                pdfBuffer.length,
                "bytes"
            );


            // -----------------------------------------
            // Send PDF
            // -----------------------------------------

            res.setHeader(
                "Content-Type",
                "application/pdf"
            );

            res.setHeader(
                "Content-Disposition",
                'attachment; filename="optimized-resume.pdf"'
            );

            res.setHeader(
                "Content-Length",
                pdfBuffer.length
            );


            console.log(
                "Sending PDF to frontend..."
            );


            console.log(
                "====================================\n"
            );


            return res
                .status(200)
                .send(pdfBuffer);


        } catch (error) {

            console.error(
                "\n========== PDF GENERATION ERROR =========="
            );

            console.error(error);


            if (
                error instanceof Error
            ) {

                console.error(
                    "Message:",
                    error.message
                );

                console.error(
                    "Stack:",
                    error.stack
                );

            }


            console.error(
                "=========================================="
            );


            return res.status(500).json({

                success: false,

                message:
                    error instanceof Error
                        ? error.message
                        : "PDF generation failed",

            });


        } finally {

            // -----------------------------------------
            // Cleanup
            // -----------------------------------------

            if (
                tempDir &&
                fs.existsSync(tempDir)
            ) {

                try {

                    fs.rmSync(
                        tempDir,
                        {
                            recursive: true,
                            force: true,
                        }
                    );

                    console.log(
                        "Temporary files cleaned."
                    );

                } catch (
                    cleanupError
                ) {

                    console.error(
                        "Cleanup error:",
                        cleanupError
                    );

                }

            }

        }

    }
);


export default pdfGeneratorRouter;