package a;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Scanner;

public class a
{
  private ArrayList a = new ArrayList();
  private ArrayList b = new ArrayList();
  private Integer c = Integer.valueOf(0);
  private ArrayList d = new ArrayList();
  private Integer[][] e = null;
  private int f = 0;
  private int[] g = null;

  public final void a()
  {
    try
    {
      BufferedReader localBufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(b.a.s)));
      long l1 = System.currentTimeMillis();
      a("get sex, phenotype and SNPs index");
      a(localBufferedReader);
      long l2 = System.currentTimeMillis();
      localBufferedReader.close();
      System.out.println("total time: " + (l2 - l1) / 1000L + " s");
      a("get SNPs from .list file");
      l1 = System.currentTimeMillis();
      a locala = this;
      b localb = new b(locala.a);
      System.out.println("List File Processor has created!");
      localb.a();
      System.out.println("List File Processor has started!");
      locala.f = localb.c();
      locala.g = localb.d();
      locala.e = localb.b();
      long l4 = Runtime.getRuntime().totalMemory();
      System.out.printf("Finished!Memory Usage: %d Mb, Total SNPs: %d\n", new Object[] { Long.valueOf(l4 / b.a.a), Integer.valueOf(locala.a.size()) });
      long l3 = System.currentTimeMillis();
      System.out.println("total time: " + (l3 - l1) / 1000L + " s");
      l1 = System.currentTimeMillis();
      a("save data into .arff file");
      c();
      l3 = System.currentTimeMillis();
      System.out.println("total time: " + (l3 - l1) / 1000L + " s");
      localBufferedReader.close();
      b();
      return;
    }
    catch (IOException localIOException)
    {
      System.out.println("IOException in start from ArffToArff.java");
      b();
      System.exit(b.a.c);
    }
  }

  private void a(BufferedReader paramBufferedReader)
  {
    Object localObject = null;
    int i = 0;
    int j = 0;
    try
    {
      while ((localObject = paramBufferedReader.readLine()) != null)
        if (((String)localObject).toLowerCase().startsWith("@relation"))
        {
          b.a.z = ((String)localObject).substring(((String)localObject).toLowerCase().indexOf(" ") + 1);
        }
        else if (((String)localObject).toLowerCase().startsWith("@attribute"))
        {
          int k;
          if (((String)localObject).toLowerCase().contains("rs"))
          {
            k = ((String)localObject).toLowerCase().indexOf("rs");
            (localObject = new StringBuffer((String)localObject)).replace(k, k + 2, "rs");
            localObject = ((StringBuffer)localObject).toString();
          }
          else if (((String)localObject).toLowerCase().contains("ss"))
          {
            k = ((String)localObject).toLowerCase().indexOf("ss");
            (localObject = new StringBuffer((String)localObject)).replace(k, k + 2, "ss");
            localObject = ((StringBuffer)localObject).toString();
          }
          String str = ((String)localObject).toLowerCase().substring(((String)localObject).indexOf(" ") + 1, ((String)localObject).indexOf(" {"));
          this.a.add(str);
          this.b.add(localObject);
          if (str.toLowerCase().startsWith("phenotype"))
          {
            this.c = Integer.valueOf(i);
            j = 1;
          }
          else if ((!str.toLowerCase().startsWith("ss")) && (!str.toLowerCase().startsWith("rs")))
          {
            this.d.add(Integer.valueOf(i));
          }
          i++;
        }
        else
        {
          if (((String)localObject).startsWith("@data"))
            break;
        }
    }
    catch (IOException localIOException)
    {
      System.out.println("IOException in getSexPhenotypeSNPIndexInArffFile from ArffToArff.java");
      b();
      System.exit(b.a.d);
    }
    if (j == 0)
    {
      System.out.println("cannot find phenotype from arff file!");
      b();
      System.exit(b.a.d);
    }
    if (this.a.isEmpty())
    {
      System.out.println("no SNP name found in arff file!");
      b();
      System.exit(b.a.d);
    }
  }

  private void c()
  {
    try
    {
      for (int i = 0; i < this.f; i++)
      {
        int j;
        if ((j = b.a.u.indexOf(".arff")) < 0)
          j = b.a.u.indexOf(".ARFF");
        Object localObject1;
        (localObject1 = new StringBuffer()).append(b.a.u.subSequence(0, j));
        ((StringBuffer)localObject1).append('_');
        ((StringBuffer)localObject1).append(i + 1);
        ((StringBuffer)localObject1).append(".arff");
        String str1 = ((StringBuffer)localObject1).toString();
        if ((localObject1 = new File(str1)).exists())
        {
          System.out.print("file " + str1 + " existed! Do you want to overwrite it? ");
          String str2;
          if ((str2 = (localObject3 = new Scanner(System.in)).nextLine()).equalsIgnoreCase("y"))
          {
            if (((File)localObject1).delete())
            {
              System.out.println("\t\told file deleted!");
            }
            else
            {
              System.out.println("\t\tcannot delete old file!");
              System.exit(b.a.f);
            }
          }
          else
          {
            System.out.println("\t\tstopped by user!");
            System.exit(b.a.f);
          }
        }
        Object localObject3 = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(str1)));
        System.out.print("trying to write @relation\t");
        a("start to save @relation into " + str1);
        ((BufferedWriter)localObject3).write(b.a.k + b.a.z + "\n\n");
        a("start to save @attribute into " + str1);
        int n;
        if (b.a.D)
          for (n = 0; n < this.g[i]; n++)
          {
            (localObject1 = new StringBuffer()).append(b.a.h);
            ((StringBuffer)localObject1).append((String)this.a.get(this.e[i][n].intValue()));
            ((StringBuffer)localObject1).append(" { 0, 1, 2 }\n");
            ((BufferedWriter)localObject3).write(((StringBuffer)localObject1).toString());
          }
        else
          for (n = 0; n < this.g[i]; n++)
          {
            ((BufferedWriter)localObject3).write((String)this.b.get(this.e[i][n].intValue()));
            ((BufferedWriter)localObject3).write(10);
          }
        Object localObject4 = new StringBuffer();
        for (int m = this.d.size(); m < this.d.size(); m++)
        {
          ((StringBuffer)localObject4).append((String)this.b.get(((Integer)this.d.get(m)).intValue()));
          ((StringBuffer)localObject4).append('\n');
        }
        ((StringBuffer)localObject4).append((String)this.b.get(this.c.intValue()));
        ((StringBuffer)localObject4).append('\n');
        ((BufferedWriter)localObject3).write(((StringBuffer)localObject4).toString());
        System.out.println("finished");
        a("start to save @data into " + str1);
        ((BufferedWriter)localObject3).write("\n@data\n");
        System.out.println("start re-open source arff file");
        if ((localObject4 = new BufferedReader(new InputStreamReader(new FileInputStream(b.a.s)))).ready())
        {
          Object localObject2 = null;
          int k = 0;
          int i1 = 0;
          while ((localObject2 = ((BufferedReader)localObject4).readLine()) != null)
          {
            i1++;
            if (k == 0)
            {
              if (i1 % 10000 == 0)
                System.out.println("\tNon-data part. Line: " + i1);
              if (!((String)localObject2).toLowerCase().trim().contains("@data"))
                continue;
              System.out.println("@data: " + ((String)localObject2).substring(0, 5));
              k = 1;
            }
            else
            {
              if (i1 % 100 == 0)
                System.out.println("\tData part. Line: " + i1);
              StringBuffer localStringBuffer = new StringBuffer();
              if ((((String)localObject2).trim().isEmpty()) || (((String)localObject2).trim().startsWith("@")) || (!((String)localObject2).contains(",")))
                continue;
              localObject2 = ((String)localObject2).split(",");
              for (int i2 = 0; i2 < this.g[i]; i2++)
              {
                localStringBuffer.append(localObject2[this.e[i][i2].intValue()]);
                localStringBuffer.append(",");
              }
              for (i2 = this.d.size(); i2 < this.d.size(); i2++)
              {
                localStringBuffer.append(localObject2[((Integer)this.d.get(i2)).intValue()]);
                localStringBuffer.append(',');
              }
              localStringBuffer.append(localObject2[this.c.intValue()]);
              localStringBuffer.append('\n');
              ((BufferedWriter)localObject3).write(localStringBuffer.toString());
            }
          }
        }
        System.out.print("trying to close source arff file\t");
        ((BufferedReader)localObject4).close();
        try
        {
          Thread.sleep(200L);
        }
        catch (InterruptedException localInterruptedException1)
        {
          System.out.println("InterruptedException in saveArffFile from ArffToArff.java");
        }
        System.out.println("finished");
        System.out.print("trying to close des arff file\t");
        ((BufferedWriter)localObject3).close();
        try
        {
          Thread.sleep(200L);
        }
        catch (InterruptedException localInterruptedException2)
        {
          System.out.println("InterruptedException in saveArffFile from ArffToArff.java");
        }
        System.out.println("finished");
      }
      return;
    }
    catch (IllegalArgumentException localIllegalArgumentException)
    {
      System.out.println("IllegalArgumentException in saveArffFile from ArffToArff.java");
      System.out.println("Please check whether the memory for buffered reader is enough");
      return;
    }
    catch (FileNotFoundException localFileNotFoundException)
    {
      System.out.println("FileNotFoundException in saveArffFile from ArffToArff.java");
      return;
    }
    catch (IOException localIOException)
    {
      System.out.println("IOException in saveArffFile from ArffToArff.java");
    }
  }

  public static int a(String[] paramArrayOfString)
  {
    for (int i = 1; i < paramArrayOfString.length; i++)
    {
      String[] arrayOfString;
      Object localObject1 = (arrayOfString = paramArrayOfString[i].split(" "))[0].toLowerCase().trim();
      System.out.printf("\t%s:\t", new Object[] { localObject1 });
      Object localObject2;
      if ((localObject2 = (localObject1 = arrayOfString)[0].toLowerCase().trim()).equalsIgnoreCase("srcr"))
        if (localObject1.length < 2)
        {
          System.out.println("srcr parameter is not enough");
          b.a.F = false;
        }
        else
        {
          localObject2 = new File(localObject1[1]);
          System.out.printf("%s:\t", new Object[] { localObject1[1] });
          if (!((File)localObject2).isFile())
          {
            System.out.println("source file didn't exist!");
            b.a.F = false;
          }
          else
          {
            System.out.println("file check OK!");
            b.a.q = localObject1[1];
            b.a.p = true;
          }
        }
      c(arrayOfString);
      d(arrayOfString);
      e(arrayOfString);
      f(arrayOfString);
      g(arrayOfString);
    }
    System.out.print("necessary file check:\n");
    if (!b.a.t)
    {
      System.out.println("\tneed arff file (destination file)");
      b.a.F = false;
    }
    if (!b.a.p)
    {
      System.out.println("\tneed raw file (source file)");
      b.a.F = false;
    }
    if ((!b.a.y) && (!b.a.A))
    {
      System.out.println("\tneed relation name for raw file");
      b.a.F = false;
    }
    System.out.println("necessary file check finished!");
    System.out.println("******************************************");
    System.out.println("***********command check result***********");
    System.out.println("******************************************");
    if (b.a.F)
    {
      System.out.println("command check success!\n\n");
      if (b.a.A)
      {
        if (b.a.w)
          System.out.println("Warning: List file is useless here when you use --fast");
        return b.a.m;
      }
      return b.a.n;
    }
    System.out.println("command check fail! please use --help to check more info\n\n");
    return 0;
  }

  public static int b(String[] paramArrayOfString)
  {
    for (int i = 1; i < paramArrayOfString.length; i++)
    {
      String[] arrayOfString;
      Object localObject1 = (arrayOfString = paramArrayOfString[i].split(" "))[0].toLowerCase().trim();
      System.out.printf("\t%s:\t", new Object[] { localObject1 });
      Object localObject2;
      if ((localObject2 = (localObject1 = arrayOfString)[0].toLowerCase().trim()).equalsIgnoreCase("srca"))
        if (localObject1.length < 2)
        {
          System.out.println("srca parameter is not enough");
          b.a.F = false;
        }
        else
        {
          localObject2 = new File(localObject1[1]);
          System.out.printf("%s:\t", new Object[] { localObject1[1] });
          if (!((File)localObject2).isFile())
          {
            System.out.println("source file didn't exist!");
            b.a.F = false;
          }
          else
          {
            System.out.println("file check OK!");
            b.a.s = localObject1[1];
            b.a.r = true;
          }
        }
      c(arrayOfString);
      d(arrayOfString);
      g(arrayOfString);
    }
    System.out.print("necessary file check:\n");
    if (!b.a.t)
    {
      System.out.println("\tneed arff file (destination file)");
      b.a.F = false;
    }
    if (!b.a.r)
    {
      System.out.println("\tneed arff file (source file)");
      b.a.F = false;
    }
    if (!b.a.w)
    {
      System.out.println("\tneed list file for arff file");
      b.a.F = false;
    }
    System.out.println("necessary file check finished!");
    System.out.println("******************************************");
    System.out.println("***********command check result***********");
    System.out.println("******************************************");
    if (b.a.F)
    {
      System.out.println("command check success!\n\n");
      return b.a.o;
    }
    System.out.println("command check fail! please use --help to check more info\n\n");
    return 0;
  }

  private static void c(String[] paramArrayOfString)
  {
    Object localObject1;
    if ((localObject1 = paramArrayOfString[0].toLowerCase().trim()).equalsIgnoreCase("des"))
    {
      if (paramArrayOfString.length < 2)
      {
        System.out.println("des parameter is not enough");
        b.a.F = false;
        return;
      }
      localObject1 = new File(paramArrayOfString[1]);
      System.out.printf("%s:\t", new Object[] { paramArrayOfString[1] });
      if (((File)localObject1).isFile())
      {
        System.out.print("file existed! Do you want to overwrite it? ");
        Object localObject2;
        if ((localObject2 = (localObject2 = new Scanner(System.in)).nextLine()).equalsIgnoreCase("Y"))
        {
          if (((File)localObject1).delete())
          {
            System.out.println("\t\told file deleted! file check OK!");
            b.a.u = paramArrayOfString[1];
            b.a.t = true;
            return;
          }
          System.out.println("\t\tcannot delete old file!");
          b.a.F = false;
          return;
        }
        System.out.println("\t\tfile check fail!");
        b.a.F = false;
        return;
      }
      int i;
      if ((i = paramArrayOfString[1].lastIndexOf('/')) < 0)
        i = paramArrayOfString[1].lastIndexOf('\\');
      if (i > 0)
      {
        localObject1 = paramArrayOfString[1].substring(0, i);
        File localFile;
        if (!(localFile = new File((String)localObject1)).isDirectory())
        {
          System.out.print("directory didn't exist! do you want to creak it?");
          if ((localObject1 = (localObject1 = new Scanner(System.in)).nextLine()).equalsIgnoreCase("Y"))
          {
            if (localFile.mkdir())
            {
              System.out.println("\t\tdirectory is created! file check OK!");
              b.a.u = paramArrayOfString[1];
              b.a.t = true;
              return;
            }
            System.out.println("\t\tcannot creat directory!");
            b.a.F = false;
            return;
          }
          System.out.println("\t\tdirectory check fail!");
          b.a.F = false;
          return;
        }
        System.out.println("file check OK!");
        b.a.u = paramArrayOfString[1];
        b.a.t = true;
        return;
      }
      System.out.println("file check OK!");
      b.a.u = paramArrayOfString[1];
      b.a.t = true;
    }
  }

  private static void d(String[] paramArrayOfString)
  {
    Object localObject;
    if ((localObject = paramArrayOfString[0].toLowerCase().trim()).equalsIgnoreCase("list"))
    {
      if (paramArrayOfString.length < 2)
      {
        System.out.println("list parameter is not enough");
        b.a.F = false;
        return;
      }
      b.a.w = true;
      localObject = new File(paramArrayOfString[1]);
      System.out.printf("%s:\t", new Object[] { paramArrayOfString[1] });
      if (!((File)localObject).isFile())
      {
        System.out.println("list file didn't exist!");
        b.a.F = false;
        return;
      }
      System.out.println("file check OK!");
      b.a.x = paramArrayOfString[1];
    }
  }

  private static void e(String[] paramArrayOfString)
  {
    Object localObject;
    if ((localObject = paramArrayOfString[0].toLowerCase().trim()).equalsIgnoreCase("name"))
    {
      if (paramArrayOfString.length < 2)
      {
        System.out.println("name parameter is not enough");
        b.a.F = false;
        return;
      }
      localObject = new StringBuffer();
      for (int i = 1; i < paramArrayOfString.length; i++)
      {
        ((StringBuffer)localObject).append(paramArrayOfString[i]);
        ((StringBuffer)localObject).append(' ');
      }
      if ((b.a.z = ((StringBuffer)localObject).toString().trim()).isEmpty())
      {
        System.out.println("list file didn't exist!");
        b.a.F = false;
        return;
      }
      System.out.println(b.a.z);
      b.a.y = true;
    }
  }

  private static void f(String[] paramArrayOfString)
  {
    String str;
    if ((str = paramArrayOfString[0].toLowerCase().trim()).equalsIgnoreCase("fast"))
    {
      b.a.A = true;
      if (paramArrayOfString.length > 1)
      {
        int i = 0;
        int j = 1;
        while (j < paramArrayOfString.length)
        {
          long l = 0L;
          try
          {
            if ((l = Long.parseLong(paramArrayOfString[j])) < 5L)
            {
              System.out.print("the parameter is too little for a block size, continue searching; ");
            }
            else if (l > 5000L)
            {
              System.out.print("the parameter is too much for a block size, continue searching; ");
            }
            else
            {
              System.out.printf("block size check OK! block size: %d Mb\n", new Object[] { Long.valueOf(l) });
              i = 1;
              b.a.B = l * b.a.a;
            }
          }
          catch (NumberFormatException localNumberFormatException)
          {
            System.out.print("not a number in fast parameter, continue searching; ");
            j++;
          }
        }
        if (i == 0)
        {
          System.out.println("block size is incorrect! use default block size (30M)!");
          return;
        }
      }
      else
      {
        System.out.println("block size check OK! use default block size (30M)!");
      }
    }
  }

  private static void g(String[] paramArrayOfString)
  {
    if ((paramArrayOfString = paramArrayOfString[0].toLowerCase().trim()).equalsIgnoreCase("test"))
    {
      System.out.println("true");
      b.a.D = true;
    }
  }

  public static void b()
  {
    String str = b.a.v;
    File localFile;
    if ((localFile = new File(str)).exists())
    {
      boolean bool1 = localFile.delete();
      boolean bool2;
      for (int i = 1; (!bool2) && (i <= 20); i++)
      {
        System.out.println("Retry: Delete " + str + " fail!");
        System.gc();
        try
        {
          Thread.sleep(500L);
        }
        catch (InterruptedException localInterruptedException2)
        {
          InterruptedException localInterruptedException1;
          (localInterruptedException1 = localInterruptedException2).printStackTrace();
        }
        bool2 = localFile.delete();
      }
      System.out.println("Delete " + str + " success!");
    }
  }

  public static int a(Integer paramInteger1, Integer paramInteger2)
  {
    return (paramInteger1.intValue() < paramInteger2.intValue() ? paramInteger1 : paramInteger2).intValue();
  }

  public static void a(String paramString)
  {
    System.out.println("★★★" + paramString + "★★★");
  }
}

/* Location:           C:\Downloads\Project\MyEclipse\pipeline.jar
 * Qualified Name:     a.a
 * JD-Core Version:    0.6.0
 */