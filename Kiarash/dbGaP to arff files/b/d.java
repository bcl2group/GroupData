package b;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;

public final class d
  implements Runnable
{
  private String a;
  private BufferedReader b;
  private Integer c = Integer.valueOf(-1);
  private boolean d = false;
  private Integer e = Integer.valueOf(-1);
  private boolean f = false;
  private ArrayList g = new ArrayList();
  private ArrayList h = new ArrayList();

  public d(String paramString, BufferedReader paramBufferedReader)
  {
    this.a = paramString;
    this.b = paramBufferedReader;
  }

  public final void run()
  {
    String[] arrayOfString = this.a.split(" ");
    int i = 0;
    for (int j = 0; j < arrayOfString.length; j++)
    {
      String str;
      if ((str = arrayOfString[j].trim()).isEmpty())
      {
        i++;
      }
      else if (str.equalsIgnoreCase("sex"))
      {
        if (this.d)
        {
          System.out.println("More column with sex value in .raw file!");
          try
          {
            this.b.close();
          }
          catch (IOException localIOException1)
          {
            System.out.println("IOException in run from StringThread.java");
          }
          a.a.b();
          System.exit(a.d);
        }
        this.c = Integer.valueOf(j - i);
        this.d = true;
      }
      else if (str.equalsIgnoreCase("phenotype"))
      {
        if (this.f)
        {
          System.out.println("More column with phenotype value in .raw file!");
          try
          {
            this.b.close();
          }
          catch (IOException localIOException2)
          {
            System.out.println("IOException in run from StringThread.java");
          }
          a.a.b();
          System.exit(a.d);
        }
        this.e = Integer.valueOf(j - i);
        this.f = true;
      }
      else
      {
        if ((!str.toLowerCase().startsWith("ss")) && (!str.toLowerCase().startsWith("rs")))
          continue;
        if (this.h.contains(str))
        {
          System.out.println("Already has the SNP " + str + " in .raw file!");
          try
          {
            this.b.close();
          }
          catch (IOException localIOException3)
          {
            System.out.println("IOException in run from StringThread.java");
          }
          a.a.b();
          System.exit(a.d);
        }
        this.g.add(Integer.valueOf(j - i));
        this.h.add(str);
      }
    }
  }

  public final Integer a()
  {
    return this.c;
  }

  public final boolean b()
  {
    return this.d;
  }

  public final Integer c()
  {
    return this.e;
  }

  public final boolean d()
  {
    return this.f;
  }

  public final ArrayList e()
  {
    return this.g;
  }

  public final ArrayList f()
  {
    return this.h;
  }
}

/* Location:           C:\Downloads\Project\MyEclipse\pipeline.jar
 * Qualified Name:     b.d
 * JD-Core Version:    0.6.0
 */