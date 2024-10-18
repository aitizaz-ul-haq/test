import clientPromise from "../../../lib/mongodb";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const client = await clientPromise;
  const db = client.db();

  try {
    const members = await db.collection("members").find({}).toArray();
    return new Response(JSON.stringify(members), { status: 200 });
  } catch (error) {
    console.error("Error fetching members:", error);
    return new Response(
      JSON.stringify({
        message: "Error fetching members",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// export async function POST(request) {
//   const memberData = await request.json();
//   const client = await clientPromise;
//   const db = client.db();

//   try {
//     const result = await db.collection("members").insertOne(memberData);
//     return new Response(
//       JSON.stringify({ message: "Member added successfully!" }),
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error adding member:", error);
//     return new Response(
//       JSON.stringify({ message: "Error adding member", error: error.message }),
//       { status: 500 }
//     );
//   }
// }

// Edit Member API

export async function POST(request) {
  const memberData = await request.json(); // This already contains all the member info
  const client = await clientPromise;
  const db = client.db();

  try {
    // Generate a default temporary password
    const defaultPassword = "defaultPassword123";

    // Hash the default password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Add the hashed password to the member data
    const updatedMemberData = {
      ...memberData,
      password: hashedPassword, // Save hashed password in DB
    };

    // Insert the new member into the database
    const result = await db.collection("members").insertOne(updatedMemberData);

    // Email transporter configuration
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Extract relevant data from memberData for email
    const { firstname, lastname, email } = memberData;

    // Email HTML template with a change password link
    const emailTemplate = `
    <div
   style="
     width: 100%;
     background-color: #effaf6;
     padding: 20px;
   "
 >
   <!-- Template Content Container -->
   <table
     align="center"
     cellpadding="0"
     cellspacing="0"
     width="100%"
     style="
       max-width: 600px;
       background-color: white;
       border-collapse: collapse;
       border-top-left-radius: 50px;
       border-top-right-radius: 50px;
       border-bottom-left-radius: 50px;
       border-bottom-right-radius: 50px;
     "
   >
     <!-- Template Header -->
     <tr>
       <td style="padding: 2rem;">
         <!-- Header Table -->
         <table width="100%">
           <tr>
             <!-- Logo on the Left -->
             <td style="width: 50%; vertical-align: top;">
               <a
                 href="https://yourcompanywebsite.com"
                 style="text-decoration: none;"
               >
                 <img
                   src="https://i.imgur.com/5sQQ2bY.png"
                   alt="Company Logo"
                   style="
                     width: 90px;
                     height: auto;
                     display: block;
                   "
                 />
               </a>
             </td>
             <!-- Social Icons, Follow Us, and Biellavita on the Right -->
             <td style="text-align: right; width: 50%; vertical-align: top;">
               <!-- Social Icons Container -->
               <table style="display: inline-block;">
                 <tr>
                   <td style="padding: 0 5px;">
                     <img
                       src="https://i.imgur.com/BxIK1ya.png"
                       alt="Social Icon"
                       style="width: 20px; height: 20px;"
                     />
                   </td>
                   <td style="padding: 0 5px;">
                     <img
                       src="https://i.imgur.com/px6RVRc.png"
                       alt="Social Icon"
                       style="width: 23px; height: 23px;"
                     />
                   </td>
                 </tr>
               </table>
               <!-- Follow Us and Biellavita -->
               <p
                 style="
                   font-size: 12px;
                   color: #333;
                   font-weight: 700;
                   margin-top: 5px;
                   text-align: right;
                 "
               >
                 Follow Us
               </p>
               <strong
                 style="
                   font-family: 'Playfair Display', serif;
                   font-style: italic;
                   font-size: 25px;
                   text-align: right;
                   display: block;
                 "
               >
                 Biellavita
               </strong>
             </td>
           </tr>
         </table>
       </td>
     </tr>
 
     <!-- Template Content -->
     <tr>
       <td
         style="
           background-color: #f5f3f3;
           padding: 20px;
           border-bottom-left-radius: 50px;
           border-bottom-right-radius: 50px;
         "
       >
         <img
           src="https://i.imgur.com/aASE61O.png"
           alt="Padlock Icon"
           style="
             width: 70px;
             height: 70px;
             display: block;
             margin: 0 auto 20px auto;
           "
         />
         <p
           style="
             color: black;
             font-family: 'Playfair Display', serif;
             font-style: italic;
             font-weight: 700;
             font-size: 30px;
             text-align: center;
           "
         >
           Welcome to Biellavita,
         </p>
         <p
           style="
             color: black;
             font-family: 'Playfair Display', serif;
             font-style: italic;
             font-size: 25px;
             text-align: center;
           "
         >
           Your Membership for Biellavita has been activated and we have created
           a secure password for you.
         </p>
         <br />
         <p
           style="
             color: black;
             font-family: 'Playfair Display', serif;
             font-style: italic;
             font-size: 25px;
             text-align: center;
           "
         >
           Please find Biellavita password for your account:
         </p>
         <br />
         <p
           style="
             color: black;
             font-family: 'Helvetica', sans-serif;
             font-weight: 700;
             font-size: 39px;
             text-align: center;
           "
         >
           defaultPassword123
         </p>
         <br />
         <p
           style="
             color: black;
             font-family: 'Playfair Display', serif;
             font-style: italic;
             font-size: 25px;
             text-align: center;
           "
         >
           Use the above password with your email id to
           <span
             style="
               font-family: 'Playfair Display', serif;
               font-style: italic;
               font-weight: 700;
               font-size: 25px;
             "
             >Change Password</span
           >
           before you log into your Biellavita account.
         </p>
         <br />
         <p
           style="
             color: black;
             font-family: 'Playfair Display', serif;
             font-style: italic;
             font-size: 25px;
             text-align: center;
           "
         >
           If you have any questions, please feel free to contact us at
           <span
             style="
               font-family: 'Playfair Display', serif;
               font-style: italic;
               font-weight: 600;
               font-size: 25px;
             "
             >help@Biellavita.com</span
           >
         </p>
         <br />
         <p
           style="
             color: black;
             font-family: 'Playfair Display', serif;
             font-style: italic;
             font-size: 25px;
             text-align: center;
           "
         >
           By using the Biellavita account, you agree to our
           <span
             style="
               font-family: 'Playfair Display', serif;
               font-weight: 600;
               font-size: 25px;
             "
             >terms & conditions & privacy policy</span
           >.
         </p>
       </td>
     </tr>
   </table>
 </div>
 
 `;

    // Send the email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Welcome, ${firstname} ${lastname}!`,
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);

    // Return a success response
    return new Response(
      JSON.stringify({ message: "Member added and email sent successfully!" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding member and sending email:", error);
    return new Response(
      JSON.stringify({ message: "Error adding member", error: error.message }),
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const { id, ...updateData } = await request.json();
  const client = await clientPromise;
  const db = client.db();

  try {
    const result = await db
      .collection("members")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ message: "No member found with that ID" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Member updated successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating member:", error);
    return new Response(
      JSON.stringify({
        message: "Error updating member",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// Delete Member API
export async function DELETE(request) {
  const { id } = await request.json();
  const client = await clientPromise;
  const db = client.db();

  try {
    const result = await db
      .collection("members")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ message: "No member found with that ID" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Member deleted successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting member:", error);
    return new Response(
      JSON.stringify({
        message: "Error deleting member",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
